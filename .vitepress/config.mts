// import { defineConfig } from "vitepress";
import sidebar from "./generateSidebar";
import mdFootnote from "markdown-it-footnote";
import mdCheckbox from "markdown-it-task-lists";
import { withMermaid } from "vitepress-plugin-mermaid";
import themeI18n from "./i18n";
import { UserConfig, DefaultTheme } from "vitepress";
// import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
// export default defineConfig({
export default withMermaid({
  title: "LinhoNotes",
  description: "一个本科笔记仓库",
  lang: "zh-CN",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "高数", link: "/高等数学/" },
      { text: "线代", link: "/线性代数/" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Linho1219/LinhoNotes" },
    ],
    search: { provider: "local" },
    sidebar: sidebar(),
    editLink: {
      pattern: 'https://github.com/Linho1219/LinhoNotes/edit/main/:path',
      text: '前往 Github 编辑此页'
    },
    outline: {
      level: [2, 3],
      label: "本页大纲",
    },
    ...themeI18n,
  },
  markdown: {
    math: true,
    config: (md) => {
      md.use(mdFootnote);
      md.use(mdCheckbox);
    },
  },
  cleanUrls: true,
  mermaid: {},
  sitemap: {
    hostname: "https://notes.linho.cc",
  },
} as UserConfig<DefaultTheme.Config>);
