import site from '#shared/site.json'
import fs from 'fs'
import { SiteConfig } from 'vitepress'

/** 生成 txt 格式 sitemap */
export default async function genreateSitemap(siteConfig: SiteConfig) {
  const siteMapArr = siteConfig.pages.map(
    (page) => `${site.baseUrl}/${encodeURI(page.replace(/(index)?\.md$/, ''))}`,
  )
  try {
    fs.writeFileSync(`${siteConfig.outDir}/sitemap.txt`, siteMapArr.join('\n'))
  } catch (err) {
    console.error('Create sitemap.txt failed!', err)
  }
}
