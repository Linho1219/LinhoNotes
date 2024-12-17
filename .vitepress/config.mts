/// <reference path="./types.d.ts" />

import mdFootnote from "markdown-it-footnote";
import mdCheckbox from "markdown-it-task-lists";
import mdMark from "markdown-it-mark";
import mdAutoSpacing from "markdown-it-autospace";

import mdPlot from "./codeblock/codeblockPlugin";
import mdFootNotePlus from "./footnote/footnotePlugin";
import mdImageViewer from "./imageViewer/imagePlugin";
import mdMjxErrWarning from "./siteData/mjxErrWarning";
import mdGitHubAlertsPlugin from "./siteData/githubAlert";
import { createContainer } from "./siteData/customContainer";

import { themeI18n, miscI18n, searchI18n } from "./i18n";
import { globalConfig } from "./manualConfig";
import iconHeader from "./siteData/iconHeader";
const { title, description, baseUrl } = globalConfig;

import nav from "./siteData/nav";
import sidebar from "./siteData/sidebar";
import genreateSitemap from "./sitemap";
import mapShortUrl from "./shortUrl/mapShortUrl";

import type { UserConfig, DefaultTheme } from "vitepress";

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
    math: true,
    languageAlias: { graph: "json5" },
    config: (md) => {
      md.use(mdFootnote);
      md.use(mdFootNotePlus);
      md.use(mdCheckbox);
      md.use(mdMark);
      md.use(mdMjxErrWarning);
      md.use(mdImageViewer);
      md.use(
        ...createContainer(
          "example",
          "例",
          { numbered: true, themeAlias: ["note"] },
          md
        )
      );
      md.use(mdGitHubAlertsPlugin);
      md.use(mdPlot);
      md.use(mdAutoSpacing, {
        pangu: true,
        mojikumi: true,
      });
    },
  },
  cleanUrls: true,
  rewrites: { "shortUrl.md": "s.md" },
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
} as UserConfig<DefaultTheme.Config>;
