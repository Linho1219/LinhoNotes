// import { defineConfig } from "vitepress";
import sidebar from "./generateSidebar";
import mdFootnote from "markdown-it-footnote";
import mdCheckbox from "markdown-it-task-lists";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
// export default defineConfig({
export default withMermaid({
  title: "LinhoNotes",
  description: "一个本科笔记仓库",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [{ text: "主页", link: "/" }],
    socialLinks: [
      { icon: "github", link: "https://github.com/Linho1219/LinhoNotes" },
    ],
    search: {
      provider: "local",
    },
    sidebar: sidebar(),
    outline: [2, 3],
  },
  markdown: {
    math: true,
    config: (md) => {
      md.use(mdFootnote);
      md.use(mdCheckbox);
    },
  },
  cleanUrls: true,
  ignoreDeadLinks: true,
  mermaid: {
    // https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults
  },
});
