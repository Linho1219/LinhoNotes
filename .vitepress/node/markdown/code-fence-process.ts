import type { MarkdownRenderer } from 'vitepress'
import { Token } from 'markdown-it'
import { markmapProcessHook } from './markmap-assets'
import { codeFormatProcessHook } from './format-code'

export type CodeFenceProcessHook = (token: Token) => null | Promise<void>

const codeFenceProcessHooks: CodeFenceProcessHook[] = [markmapProcessHook, codeFormatProcessHook]

export default function mdCodeFenceProcessHook(md: MarkdownRenderer) {
  const render = md.render.bind(md)
  const renderAsync = md.renderAsync.bind(md)
  const prepared = new WeakMap<object, Token[]>()

  md.render = (src, env) => {
    const tokens = env && prepared.get(env)
    if (!tokens) return render(src, env)
    prepared.delete(env)
    return md.renderer.render(tokens, md.options, env)
  }

  // preConfig runs before VitePress wraps renderAsync to expand Markdown includes.
  md.renderAsync = async (src, env) => {
    env ??= {}
    const tokens = md.parse(src, env)
    const tasks = tokens
      .filter((token) => token.type === 'fence' && !token.meta?.src)
      .map(async (token) => {
        for (const hook of codeFenceProcessHooks) {
          const promise = hook(token)
          if (hook(token) !== null) return promise
        }
      })
    if (tasks.length) await Promise.all(tasks)

    // MarkdownItAsync calls render synchronously, then resolves Shiki's placeholders.
    prepared.set(env, tokens)
    return renderAsync(src, env)
  }
}
