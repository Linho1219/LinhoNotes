import prettier from '@prettier/sync'
import { execSync } from 'child_process'
import JSON5 from 'json5'
import type MarkdownIt from 'markdown-it'
import path from 'node:path'

const prettierTable: Record<string, string> = {
  ts: 'typescript',
  typescript: 'typescript',
  js: 'babel',
  javascript: 'babel',
  css: 'css',
  scss: 'scss',
  less: 'less',
  json: 'json',
  json5: 'json5',
  jsonc: 'jsonc',
  markdown: 'markdown',
  md: 'markdown',
  html: 'html',
  vue: 'vue',
  angular: 'angular',
  yaml: 'yaml',
}
const clangs = ['c', 'c++', 'cpp', 'cxx']

interface FileWidgetDescriptor {
  kind: string
}

const fileWidgets = new Map<string, FileWidgetDescriptor>([['.ggb', { kind: 'geogebra' }]])

function getAssetUrl(src: string, importer: string): string {
  let relativePath = path.relative(path.dirname(importer), src).replaceAll('\\', '/')
  if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`
  return `${relativePath}?no-inline`
}

export default function mdPlot(md: MarkdownIt): void {
  const fence = md.renderer.rules.fence!.bind(md.renderer.rules)!
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const language = token.info.trim()
    if (language.startsWith('mermaid'))
      return /* html */ `<ClientOnly><Mermaid id="mermaid-${idx}" code="${encodeURIComponent(
        token.content,
      )}" /></ClientOnly>`
    if (language.startsWith('graph')) {
      try {
        JSON5.parse(token.content)
      } catch (e) {
        if (process.env.NODE_ENV === 'production') throw e
        else console.error('\nGraph parse error:\n  ' + String(e))
      }
      return /* html */ `<ClientOnly><Plot id="funcion-${idx}" code="${encodeURIComponent(
        token.content,
      )}" /></ClientOnly>`
    }
    const src = token.meta?.src as string | undefined
    const widget = src && fileWidgets.get(path.extname(src).toLowerCase())
    if (src && widget) {
      // The original VitePress snippet renderer normally registers imported
      // files here. This branch bypasses that renderer, so keep HMR/watch
      // tracking intact ourselves.
      env.includes?.push(src)

      const importer = (env.realPath ?? env.path) as string | undefined
      if (!importer) throw new Error(`Cannot resolve widget asset from ${src}`)

      const assetUrl = md.utils.escapeHtml(getAssetUrl(src, importer))
      const mode = token.meta?.region
      const modeAttribute = mode ? ` mode="${md.utils.escapeHtml(String(mode))}"` : ''

      return /* html */ `<ClientOnly><FileWidget kind="${widget.kind}" src="${assetUrl}"${modeAttribute} /></ClientOnly>`
    }

    const info = tokens[idx].info

    // 代码格式化
    if (!/:escape-format\b/.test(info)) {
      if (prettierTable[language]) {
        try {
          token.content = prettier.format(token.content, {
            parser: prettierTable[language],
            printWidth: 76,
          })
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') console.warn('\nIllegal code:' + String(err))
        }
      } else if (clangs.includes(language.toLowerCase())) {
        try {
          const formatted = execSync(
            `clang-format -style="{BasedOnStyle: llvm, IndentWidth: 4, ColumnLimit: 75}"`,
            { input: token.content, encoding: 'utf-8' },
          )
          token.content = formatted
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') console.warn('\nIllegal code' + String(err))
        }
      }
    }

    const extraClasses: string[] = ['code-block']
    if (/:wrap\b/.test(info)) extraClasses.push('code-block-wrap')
    return fence(tokens, idx, options, env, self).replace(
      /(?<=class=")/,
      extraClasses.join(' ') + ' ',
    )
  }
}
