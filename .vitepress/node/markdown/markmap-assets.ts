import { parse } from '@markmap/parse'
import { mathContent, remarkMath } from '@markmap/plugin-math'
import {
  approximateMeasurer,
  defaultContentPlugins,
  minimalTheme,
  renderTreeAsync,
  resolveRenderOptions,
  toSVGString,
} from '@markmap/render'
import { createHash } from 'node:crypto'
import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { CodeFenceProcessHook } from './code-fence-process'

export const markmapDir = path.resolve('.vitepress/cache/markmap')

export function markmapFilename(content: string): string {
  return `markmap-${createHash('sha256').update('markmap-v3\0').update(content).digest('hex').substring(0, 16)}.svg`
}

export async function renderMarkmapAsset(content: string): Promise<void> {
  const target = path.join(markmapDir, markmapFilename(content))
  try {
    await access(target)
    return
  } catch {
    // New or changed map: render it below.
  }
  const { root, frontmatter } = parse(content, { plugins: [remarkMath] })
  const { options, warnings } = resolveRenderOptions({ theme: minimalTheme }, frontmatter.markmap)
  if (warnings.length) throw new Error(`Invalid markmap frontmatter: ${warnings.join('; ')}`)
  const theme = options.theme ?? minimalTheme
  const result = await renderTreeAsync(root, {
    ...options,
    theme: { ...theme, tokens: { ...theme.tokens, 'mm-text': '#000' } },
    measurer: approximateMeasurer,
    plugins: [...defaultContentPlugins, mathContent],
  })
  await mkdir(markmapDir, { recursive: true })
  await writeFile(target, toSVGString(result, { background: false }))
}

export const markmapProcessHook: CodeFenceProcessHook = (token) => {
  if (token.info.trim() === 'markmap') return renderMarkmapAsset(token.content)
  else return null
}
