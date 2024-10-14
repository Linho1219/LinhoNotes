import { defineConfig } from "vitepress";
import AutoSidebarPlugin from "vitepress-auto-sidebar-plugin";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LinhoNotes",
  description: "一个本科笔记仓库",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "高等数学", link: "/%e9%ab%98%e7%ad%89%e6%95%b0%e5%ad%a6/0%20%e7%ae%80%e4%bb%8b" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
  markdown: {
    math: true,
  },
  vite: {
    plugins: [
      AutoSidebarPlugin({
        srcDir: "./",
      }),
    ],
  },
  srcExclude: ["**/README.md"],
  outDir: '../build'
});
