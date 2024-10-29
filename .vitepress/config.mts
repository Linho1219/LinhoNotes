/// <reference path="./types.d.ts" />

import mdFootnote from "markdown-it-footnote";
import mdCheckbox from "markdown-it-task-lists";
import mdMark from "markdown-it-mark";
import { UserConfig, DefaultTheme } from "vitepress";
import { defineConfig } from "vitepress";
import { themeI18n, miscI18n, searchI18n } from "./i18n";
import codePlugin from "./codeblock/codeblockHijack";
import nav from "./nav";
import sidebar from "./sidebar";
import genreateSitemap from "./sitemap";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LinhoNotes",
  description: "一个笔记仓库",
  lang: "zh-CN",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
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
    lastUpdated: {
      text: miscI18n.lastUpdated,
      formatOptions: {
        dateStyle: "short",
        timeStyle: "short",
      },
    },
    ...themeI18n,
  },
  markdown: {
    math: true,
    config: (md) => {
      md.use(mdFootnote);
      md.use(mdCheckbox);
      md.use(mdMark);
      md.use(codePlugin);
    },
  },
  cleanUrls: true,
  sitemap: {
    hostname: "https://notes.linho.cc",
  },
  buildEnd: genreateSitemap,
} as UserConfig<DefaultTheme.Config>);
