import { defineConfig } from "vitepress";
import { generateSidebar } from "./generateSidebar";

function sidebar() {
  return {
    高等数学: generateSidebar("高等数学"),
    线性代数: generateSidebar("线性代数"),
    机甲大师: generateSidebar("机甲大师"),
    高级英语: generateSidebar("高级英语"),
    "JavaScript 教程": generateSidebar("JavaScript 教程"),
    "C-C++ 相关": generateSidebar("C-C++ 相关"),
    杂项: generateSidebar("杂项"),
  };
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LinhoNotes",
  description: "一个本科笔记仓库",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "主页", link: "/" }],
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
  },
  srcExclude: ["**/README.md"],
  outDir: "../build",
  cleanUrls: true,
});
