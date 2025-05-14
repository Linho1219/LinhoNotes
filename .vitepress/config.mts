/// <reference path="./types.d.ts" />

import mdFootnote from "markdown-it-footnote";
import mdCheckbox from "markdown-it-task-lists";
import mdSup from "markdown-it-sup";
import mdSub from "markdown-it-sub";
import mdAutoSpacing from "./spacing/spacing";

import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";
import getContributorPlugin from "./contributors/addContributors";

import mdPlot from "./codeblock/codeblockPlugin";
import mdFootNotePlus from "./footnote/footnotePlugin";
import mdImageViewer from "./imageViewer/imagePlugin";
import mdWrapper from "./configurablePlugins/customWrapper";
import mdLinkClass from "./configurablePlugins/customLinkClassName";
import mdMjxErrWarning from "./siteData/mjxErrWarning";
import mdGitHubAlertsPlugin from "./siteData/githubAlert";
import { createContainer } from "./configurablePlugins/customContainer";

import { themeI18n, miscI18n, searchI18n } from "./i18n";
import { globalConfig } from "./manualConfig";
import iconHeader from "./siteData/iconHeader";
const { title, description, baseUrl } = globalConfig;

import nav from "./siteData/nav";
import sidebar from "./siteData/sidebar";
import genreateSitemap from "./sitemap";
import mapShortUrl from "./shortUrl/mapShortUrl";

import type { UserConfig, DefaultTheme } from "vitepress";
import { resolve } from "node:path";

// https://vitepress.dev/reference/site-config
export default {
  title,
  description,
  lang: "zh-CN",
  head: [
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
      },
    ],
    ["script", { src: "https://www.geogebra.org/apps/deployggb.js" }],
    ...iconHeader,
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/title_logo.svg",
    nav,
    socialLinks: [
      { icon: "github", link: "https://github.com/Linho1219/LinhoNotes" },
    ],
    search: {
      provider: "algolia",
      options: {
        appId: "VZX3XG9QDI",
        apiKey: "5f1b16068879fe196235e0b2bf6a607a",
        indexName: "linho",
        placeholder: miscI18n.searchPlaceHolder,
        buttonText: miscI18n.searchBtnText,
        translations: searchI18n,
        disableUserPersonalization: true,
        maxResultsPerGroup: 6,
      },
    },
    sidebar: sidebar(),
    editLink: {
      pattern:
        "https://github.com/Linho1219/LinhoNotes/blob/main/:path?plain=1",
      text: miscI18n.editLink,
    },
    outline: {
      level: [2, 3],
      label: miscI18n.outline,
    },
    lastUpdated:
      process.env.NODE_ENV === "production"
        ? {
            text: miscI18n.lastUpdated,
            formatOptions: {
              dateStyle: "short",
              timeStyle: "short",
            },
          }
        : false,
    ...themeI18n,
  },
  markdown: {
    math: {
      tex: {
        macros: {
          oiint: `{\\subset\\!\\supset} \\mathllap{\\iint}`,
          oiiint: `{\\Large{\\subset\\!\\supset}} \\mathllap{\\iiint}`,
        },
      },
    },
    languageAlias: { graph: "json5" },
    config: (md) => {
      md.use(groupIconMdPlugin)
        .use(mdFootnote)
        .use(mdFootNotePlus)
        .use(mdCheckbox)
        .use(mdSup)
        .use(mdSub)
        .use(mdWrapper, { marker: "%", tag: "Cloze" })
        .use(mdWrapper, { marker: "=", tag: "mark" })
        .use(mdLinkClass, { className: "animated-link" })
        .use(mdMjxErrWarning)
        .use(mdImageViewer)
        .use(
          ...createContainer(
            "example",
            "例",
            { numbered: true, themeAlias: ["note"] },
            md
          )
        )
        .use(mdGitHubAlertsPlugin)
        .use(mdPlot)
        .use(mdAutoSpacing);
    },
  },
  cleanUrls: true,
  rewrites: { "shortUrl.md": "s.md" },
  srcExclude: ["CODE_OF_CONDUCT.md", "CONTRIBUTING.md"],
  metaChunk: true,
  sitemap: { hostname: baseUrl },
  buildEnd: (siteConfig) => {
    genreateSitemap(siteConfig);
    mapShortUrl(siteConfig);
  },
  vue: {
    template: {
      compilerOptions: { isCustomElement: (tag) => tag.startsWith("punc-") },
    },
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 8192,
    },
    plugins: [
      groupIconVitePlugin(),
      ...(process.env.NODE_ENV === "production" &&
      !process.env.DISABLE_CONTRIBUTORS
        ? [await getContributorPlugin()]
        : []),
    ],
    ssr: {
      noExternal: ["@nolebase/vitepress-plugin-highlight-targeted-heading"],
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "./"),
        },
      ],
    },
  },
} as UserConfig<DefaultTheme.Config>;
