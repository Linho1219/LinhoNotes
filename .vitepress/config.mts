import sidebar from "./generateSidebar";
import mdFootnote from "markdown-it-footnote";
import mdCheckbox from "markdown-it-task-lists";
import { themeI18n, miscI18n } from "./i18n";
import { UserConfig, DefaultTheme } from "vitepress";
import { defineConfig } from "vitepress";
import codePlugin from "./codeblock/codeblockHijack";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LinhoNotes",
  description: "一个本科笔记仓库",
  lang: "zh-CN",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/title_logo.svg",
    nav: [
      { text: "主页", link: "/" },
      { text: "高数", link: "/高等数学/" },
      { text: "线代", link: "/线性代数/" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Linho1219/LinhoNotes" },
    ],
    search:
      process.env.NODE_ENV === "production" ? { provider: "local" } : false,
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
      md.use(codePlugin);
    },
  },
  cleanUrls: true,
  sitemap: {
    hostname: "https://notes.linho.cc",
  },
} as UserConfig<DefaultTheme.Config>);
