import { exactRegex } from '@rolldown/pluginutils'
import fs from 'node:fs'
import path from 'node:path'

const PalettePath = path.resolve(__dirname, '../../palette.json')
const PaletteJSON = JSON.parse(fs.readFileSync(PalettePath, 'utf-8')) as {
  light: {
    text: Record<string, string>
    soft: Record<string, string>
  }
  dark: {
    text: Record<string, string>
    soft: Record<string, string>
  }
}
const PaletteCSS = /* css */ `
:root {
  ${Object.entries(PaletteJSON.light.text)
    .map(([key, value]) => `--ln-c-${key}: ${value};`)
    .join('\n  ')}

  ${Object.entries(PaletteJSON.light.soft)
    .map(([key, value]) => `--ln-c-${key}-soft: ${value};`)
    .join('\n  ')}
}

.dark {
  ${Object.entries(PaletteJSON.dark.text)
    .map(([key, value]) => `--ln-c-${key}: ${value};`)
    .join('\n  ')}

  ${Object.entries(PaletteJSON.dark.soft)
    .map(([key, value]) => `--ln-c-${key}-soft: ${value};`)
    .join('\n  ')}
}
`

export default function myPlugin() {
  const virtualModuleId = 'virtual:palette.css'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'virtual-palette-css',
    resolveId: {
      filter: { id: exactRegex(virtualModuleId) },
      handler() {
        return resolvedVirtualModuleId
      },
    },
    load: {
      filter: { id: exactRegex(resolvedVirtualModuleId) },
      handler() {
        return PaletteCSS
      },
    },
  }
}
