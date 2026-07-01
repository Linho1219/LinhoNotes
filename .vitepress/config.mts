import site from '#shared/site.json'
import { miscI18n, searchI18n, themeI18n } from './node/i18n'
import mdPlot from './node/markdown/codeblock-plugin'
import { createContainer } from './node/markdown/custom-container-plugin'
import mdLinkClass from './node/markdown/custom-link-classname-plugin'
import mdWrapper from './node/markdown/custom-wrapper-plugin'
import mdFootNotePlus from './node/markdown/footnote-plugin'
import mdGfmAlertPlugin from './node/markdown/gfm-alert-plugin'
import mdImageViewer from './node/markdown/image-plugin'
import mdMath from './node/markdown/math-plugin'
import mdAutoSpacing from './node/markdown/spacing-plugin'
import iconHeader from './node/site/icon-header'
import nav from './node/site/nav'
import sidebar from './node/site/sidebar'
import getContributorPlugin from './node/vite/add-contributors'
import mapShortUrl from './node/vite/map-short-url'
import genreateSitemap from './node/vite/sitemap'
import tsconfigApp from './tsconfig.app.json'
import mdFootnote from 'markdown-it-footnote'
import mdSub from 'markdown-it-sub'
import mdSup from 'markdown-it-sup'
import mdCheckbox from 'markdown-it-task-lists'
import { resolve } from 'node:path'
import type { DefaultTheme, UserConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

const alias = Object.entries(tsconfigApp.compilerOptions.paths).map(([key, value]) => ({
  find: key.replace(/\/\*$/, ''),
  replacement: resolve(__dirname, value[0].replace(/\/\*$/, '')),
}))

const { title, description, baseUrl } = site
// https://vitepress.dev/reference/site-config
export default {
  title,
  description,
  lang: 'zh-CN',
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
      },
    ],
    ['script', { src: 'https://www.geogebra.org/apps/deployggb.js' }],
    ...iconHeader,
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/title_logo.svg',
    nav,
    socialLinks: [{ icon: 'github', link: site.repo.url }],
    search: {
      provider: 'algolia',
      options: {
        appId: 'VZX3XG9QDI',
        apiKey: '5f1b16068879fe196235e0b2bf6a607a',
        indexName: 'linho',
        placeholder: miscI18n.searchPlaceHolder,
        buttonText: miscI18n.searchBtnText,
        translations: searchI18n,
        disableUserPersonalization: true,
        maxResultsPerGroup: 6,
      },
    },
    sidebar: sidebar(),
    editLink: {
      pattern: 'https://github.com/Linho1219/LinhoNotes/blob/main/:path?plain=1',
      text: miscI18n.editLink,
    },
    outline: {
      level: [2, 3],
      label: miscI18n.outline,
    },
    lastUpdated:
      process.env.NODE_ENV === 'production'
        ? {
            text: miscI18n.lastUpdated,
            formatOptions: { dateStyle: 'short', timeStyle: 'short' },
          }
        : false,
    ...themeI18n,
  },
  markdown: {
    languageAlias: { graph: 'json5' },
    config: (md) => {
      md.use(groupIconMdPlugin)
        .use(mdFootnote)
        .use(mdFootNotePlus)
        .use(mdCheckbox)
        .use(mdSup)
        .use(mdSub)
        .use(mdWrapper, { marker: '%', tag: 'Cloze' })
        .use(mdWrapper, { marker: '=', tag: 'mark' })
        .use(mdLinkClass, { className: 'animated-link' })
        .use(mdMath)
        .use(mdImageViewer)
        .use(...createContainer('example', '例', { numbered: true, themeAlias: ['note'] }, md))
        .use(mdGfmAlertPlugin)
        .use(mdPlot)
        .use(mdAutoSpacing)
    },
  },
  cleanUrls: true,
  rewrites: { 'shortUrl.md': 's.md' },
  srcExclude: ['CODE_OF_CONDUCT.md', 'CONTRIBUTING.md'],
  metaChunk: true,
  sitemap: { hostname: baseUrl },
  buildEnd: (siteConfig) => {
    genreateSitemap(siteConfig)
    mapShortUrl(siteConfig)
  },
  vue: {
    template: {
      compilerOptions: { isCustomElement: (tag) => tag.startsWith('punc-') },
    },
  },
  vite: {
    build: { chunkSizeWarningLimit: 8192 },
    plugins: [
      groupIconVitePlugin(),
      ...(process.env.NODE_ENV === 'production' && !process.env.DISABLE_CONTRIBUTORS
        ? [await getContributorPlugin()]
        : []),
    ],
    ssr: {
      noExternal: ['@nolebase/vitepress-plugin-highlight-targeted-heading'],
    },
    resolve: { alias },
  },
} as UserConfig<DefaultTheme.Config>
