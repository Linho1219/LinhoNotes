import { createLegacyShortId, createShortId, normalizePagePath } from '#shared/short-url'
import type { Plugin, ResolvedConfig } from 'vite'
import type { SiteConfig } from 'vitepress'

type ShortUrlMap = {
  [key: string]: string
}

const moduleId = 'virtual:short-url-map'
const resolvedModuleId = `\0${moduleId}`

function addMapping(map: ShortUrlMap, id: string, path: string, version: string) {
  const existingPath = map[id]
  if (existingPath !== undefined && existingPath !== path) {
    throw new Error(
      `Short URL ${version} collision: "${existingPath}" and "${path}" both map to "${id}"`,
    )
  }

  map[id] = path
}

function createMaps(siteConfig: SiteConfig) {
  const legacy: ShortUrlMap = {}
  const current: ShortUrlMap = {}

  for (const sourcePage of siteConfig.pages) {
    const page = siteConfig.rewrites.map[sourcePage] ?? sourcePage
    const path = normalizePagePath(page)

    // 跳转页不可跳转至自身
    if (path === 's') continue

    addMapping(legacy, createLegacyShortId(path), path, 'v1')
    addMapping(current, createShortId(path), path, 'v2')
  }

  return { legacy, current }
}

export default function mapShortUrl(): Plugin {
  let siteConfig: SiteConfig | undefined

  return {
    name: 'linho-notes:short-url-map',
    configResolved(config: ResolvedConfig) {
      siteConfig = config.vitepress
    },
    resolveId(id) {
      if (id === moduleId) return resolvedModuleId
    },
    load(id) {
      if (id !== resolvedModuleId) return
      if (!siteConfig) throw new Error('VitePress site config is unavailable')

      return `export default ${JSON.stringify(createMaps(siteConfig))}`
    },
  }
}
