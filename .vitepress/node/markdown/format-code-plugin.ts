import { getNativeBinary } from 'clang-format'
import type { Token } from 'markdown-it'
import { exec, execFile } from 'node:child_process'
import { availableParallelism } from 'node:os'
import prettier from 'prettier'
import type { MarkdownRenderer } from 'vitepress'

const prettierParsers = new Map([
  ['ts', 'typescript'],
  ['typescript', 'typescript'],
  ['js', 'babel'],
  ['javascript', 'babel'],
  ['css', 'css'],
  ['scss', 'scss'],
  ['less', 'less'],
  ['json', 'json'],
  ['json5', 'json5'],
  ['jsonc', 'jsonc'],
  ['markdown', 'markdown'],
  ['md', 'markdown'],
  ['html', 'html'],
  ['vue', 'vue'],
  ['angular', 'angular'],
  ['yaml', 'yaml'],
])
const clangLanguages = /^(c|c\+\+|cpp|cxx)$/i
const clangStyle = '{BasedOnStyle: llvm, IndentWidth: 4, ColumnLimit: 75}'

function createClangFormatter() {
  // Skip the npm wrapper on supported platforms and use the PATH command elsewhere.
  let binary: string | undefined
  try {
    binary = getNativeBinary()
  } catch {}

  const concurrency = Math.min(availableParallelism(), 8)
  const waiting: (() => void)[] = []
  let active = 0

  return async (code: string): Promise<string> => {
    if (active < concurrency) active++
    else await new Promise<void>((resolve) => waiting.push(resolve))

    try {
      return await new Promise<string>((resolve, reject) => {
        const formatOptions = { encoding: 'utf8' } as const
        const done = (error: Error | null, stdout: string, stderr: string) => {
          if (stderr) process.stderr.write(stderr)
          if (error) reject(error)
          else resolve(stdout)
        }
        const child = binary
          ? execFile(binary, [`-style=${clangStyle}`], formatOptions, done)
          : exec(`clang-format -style="${clangStyle}"`, formatOptions, done)
        // The formatter may close stdin early when it fails.
        child.stdin!.on('error', () => {})
        child.stdin!.end(code)
      })
    } finally {
      const next = waiting.shift()
      if (next) next()
      else active--
    }
  }
}

export default function formatCodeFences(md: MarkdownRenderer) {
  const formatClang = createClangFormatter()
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
        if (/:escape-format\b/.test(token.info)) return
        const language = token.info.trim()
        const prettierParser = prettierParsers.get(language)
        try {
          if (prettierParser)
            token.content = await prettier.format(token.content, {
              parser: prettierParser,
              printWidth: 75,
            })
          else if (clangLanguages.test(language)) token.content = await formatClang(token.content)
        } catch (error) {
          if (process.env.NODE_ENV !== 'production')
            console.warn('\nIllegal code: ' + String(error))
        }
      })
    if (tasks.length) await Promise.all(tasks)

    // MarkdownItAsync calls render synchronously, then resolves Shiki's placeholders.
    prepared.set(env, tokens)
    return renderAsync(src, env)
  }
}
