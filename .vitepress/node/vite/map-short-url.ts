import {
  createLegacyShortId,
  createShortId,
  encodePagePath,
  normalizePagePath,
  SHORT_ID_LENGTH,
} from '#shared/short-url'
import site from '#shared/site.json'
import fs from 'node:fs'
import path from 'node:path'
import { escape } from 'lodash-es'
import type { Plugin, ResolvedConfig } from 'vite'
import type { PageData, SiteConfig } from 'vitepress'

type ShortUrlEntry = {
  id: string
  legacyId: string
  path: string
}

const moduleId = 'virtual:legacy-short-url-map'
const resolvedModuleId = `\0${moduleId}`
const shortIdPattern = new RegExp(`^[0-9a-z]{${SHORT_ID_LENGTH}}$`)
const pageTitles = new Map<string, string>()

export function collectShortUrlPageData(pageData: PageData) {
  if (pageData.isNotFound) return
  pageTitles.set(
    normalizePagePath(pageData.relativePath),
    pageData.title ? `${pageData.title} | ${site.title}` : site.title,
  )
}

function assertUniqueIds(
  entries: ShortUrlEntry[],
  getId: (entry: ShortUrlEntry) => string,
  version: string,
) {
  const pathsById = new Map<string, string>()

  for (const entry of entries) {
    const id = getId(entry)
    const existingPath = pathsById.get(id)
    if (existingPath !== undefined && existingPath !== entry.path)
      throw new Error(
        `Short URL ${version} collision: "${existingPath}" and "${entry.path}" both map to "${id}"`,
      )
    pathsById.set(id, entry.path)
  }
}

function validateEntries(entries: ShortUrlEntry[]) {
  assertUniqueIds(entries, (entry) => entry.legacyId, 'v1')
  assertUniqueIds(entries, (entry) => entry.id, 'v2')

  const rootRoutes = new Set(
    entries
      .map((entry) => entry.path.replace(/\/$/, ''))
      .filter((route) => route && !route.includes('/')),
  )

  for (const entry of entries)
    if (rootRoutes.has(entry.id))
      throw new Error(
        `Short URL "${entry.id}" for "${entry.path}" conflicts with a root route of the same name`,
      )
}

function createShortUrlData(siteConfig: SiteConfig) {
  const entries = siteConfig.pages
    .map((sourcePage) => siteConfig.rewrites.map[sourcePage] ?? sourcePage)
    .map(normalizePagePath)
    .filter((targetPath) => targetPath !== 's')
    .map((targetPath) => ({
      id: createShortId(targetPath),
      legacyId: createLegacyShortId(targetPath),
      path: targetPath,
    }))

  validateEntries(entries)

  return {
    entries,
    legacyMap: Object.fromEntries(entries.map((entry) => [entry.legacyId, entry.path])),
  }
}

function createRedirectHtml(title: string, targetUrl: string, lang: string) {
  const canonical = escape(targetUrl)

  return /* html */ `<!DOCTYPE html>
    <html lang="${escape(lang)}">
      <head>
        <meta charset="utf-8">
        <title>${escape(title)}</title>
        <meta name="description" content="${escape(site.description)}">
        <meta name="robots" content="noindex">
        <link rel="canonical" href="${canonical}">
        <meta http-equiv="refresh" content="0;url=${canonical}">
        <script>location.replace(document.querySelector('link').href)</script>
        <style>:root{background-color:light-dark(white,#1B1B1F);}</style>
      </head>
    </html>
    `.replaceAll(/\n\s+/g, '')
}

function validateOutputTargets(entries: ShortUrlEntry[], names: string[]) {
  const existingNames = new Set(names.map((name) => name.toLowerCase()))

  for (const entry of entries) {
    const outputName = `${entry.id}.html`
    if (existingNames.has(outputName) || existingNames.has(entry.id))
      throw new Error(
        `Short URL output "${outputName}" for "${entry.path}" conflicts with an existing build output`,
      )

    if (!pageTitles.has(entry.path))
      throw new Error(`Missing VitePress page title for short URL target "${entry.path}"`)
  }
}

export async function generateShortUrlRedirects(siteConfig: SiteConfig) {
  const { entries } = createShortUrlData(siteConfig)
  validateOutputTargets(entries, await fs.promises.readdir(siteConfig.outDir))

  await Promise.all(
    entries.map(async (entry) => {
      const title = pageTitles.get(entry.path)!
      const targetUrl = new URL(`/${encodePagePath(entry.path)}`, site.baseUrl).href
      const html = createRedirectHtml(title, targetUrl, siteConfig.site.lang)
      await fs.promises.writeFile(path.join(siteConfig.outDir, `${entry.id}.html`), html)
    }),
  )
}

export default function mapShortUrl(): Plugin {
  let shortUrlData: ReturnType<typeof createShortUrlData> | undefined

  return {
    name: 'linho-notes:short-url',
    configResolved(config: ResolvedConfig) {
      if (!config.vitepress) throw new Error('VitePress site config is unavailable')
      shortUrlData = createShortUrlData(config.vitepress)
    },
    resolveId(id) {
      if (id === moduleId) return resolvedModuleId
    },
    load(id) {
      if (id !== resolvedModuleId) return
      if (!shortUrlData) throw new Error('VitePress site config is unavailable')
      return `export default ${JSON.stringify(shortUrlData.legacyMap)}`
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!shortUrlData || !request.url) return next()

        const pathname = new URL(request.url, 'http://localhost').pathname
        const id = pathname.match(/^\/([0-9a-z]+)\/?$/)?.[1]
        if (!id || !shortIdPattern.test(id)) return next()

        const entry = shortUrlData.entries.find((candidate) => candidate.id === id)
        if (!entry) return next()

        response.statusCode = 302
        response.setHeader('Location', `/${encodePagePath(entry.path)}`)
        response.end()
      })
    },
  }
}
