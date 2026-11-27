import JSON5 from 'json5'
import type MarkdownIt from 'markdown-it'
import path from 'node:path'
import { encodeHtmlAttr } from './utils.ts'
import base64 from 'base-64'
import utf8 from 'utf8'
import site from '#shared/site.json' with { type: 'json' }

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
        const parsed = JSON5.parse(token.content)
        const minified = JSON5.stringify(parsed)
        const shareQuery = base64.encode(utf8.encode(minified)).replace(/=+$/g, '')
        const shareLink = site.externalGraphBase + shareQuery
        return /* html */ `<ClientOnly><Plot id="funcion-${idx}" json5="${encodeHtmlAttr(
          minified,
        )}" externalLink="${encodeHtmlAttr(shareLink)}" /></ClientOnly>`
      } catch (e) {
        if (process.env.NODE_ENV === 'production') throw e
        else console.error('\nGraph parse error:\n  ' + String(e))
      }
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
