import JSON5 from 'json5'
import type MarkdownIt from 'markdown-it'
import path from 'node:path'
import { encodeHtmlAttr } from './utils.ts'

interface FileWidgetDescriptor {
  kind: string
}

const fileWidgets = new Map<string, FileWidgetDescriptor>([
  ['.ggb', { kind: 'geogebra' }],
  ['.geojson', { kind: 'geojson' }],
])

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
    if (language.match(/^mermaid\b/))
      return /* html */ `<ClientOnly><Mermaid id="mermaid-${idx}" code="${encodeHtmlAttr(
        token.content,
      )}" /></ClientOnly>`
    if (language.match(/^(?:markmap|mindmap)\b/))
      return /* html */ `<ClientOnly><Markmap id="markmap-${idx}" code="${encodeHtmlAttr(
        token.content,
      )}" /></ClientOnly>`
    if (language.match(/^(?:function-plot|fp|graph)\b/)) {
      try {
        JSON5.parse(token.content)
      } catch (e) {
        if (process.env.NODE_ENV === 'production') throw e
        else console.error('\nGraph parse error:\n  ' + String(e))
      }
      return /* html */ `<ClientOnly><Plot id="funcion-${idx}" code="${encodeHtmlAttr(
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

    const extraClasses: string[] = ['code-block']
    if (/:wrap\b/.test(info)) extraClasses.push('code-block-wrap')
    return fence(tokens, idx, options, env, self).replace(
      /(?<=class=")/,
      extraClasses.join(' ') + ' ',
    )
  }
}
