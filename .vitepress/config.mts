// import { defineConfig } from "vitepress";
import { generateSidebar } from "./generateSidebar";
import mdFootnote from "markdown-it-footnote";
import mdCheckbox from "markdown-it-task-lists";
import { withMermaid } from "vitepress-plugin-mermaid";

function sidebar() {
  return {
    高等数学: generateSidebar("高等数学"),
    线性代数: generateSidebar("线性代数"),
    机甲大师: generateSidebar("机甲大师"),
    高级英语: generateSidebar("高级英语"),
    "JavaScript 教程": generateSidebar("JavaScript 教程"),
    "C-C++ 相关": generateSidebar("C-C++ 相关"),
    算法相关: generateSidebar("算法相关"),
    杂项: generateSidebar("杂项"),
  };
}

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
