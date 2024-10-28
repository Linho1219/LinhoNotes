import { DefaultTheme } from "vitepress";

type Nav = {
  text: string;
  link: string;
  activeMatch?: string;
}[];

const nav: Nav = [
  { text: "高数", link: "高等数学" },
  { text: "线代", link: "线性代数" },
  { text: "RM", link: "机甲大师" },
  { text: "JS", link: "JavaScript 教程" },
  { text: "C++", link: "C-C++ 相关" },
  { text: "算法", link: "算法相关" },
  { text: "指南", link: "仓库贡献指南" },
] as const;

const escapeRegExp = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseNav = (orig: Nav): DefaultTheme.NavItem[] =>
  orig.map((orig) => ({
    text: orig.text,
    link: `/${orig.link}/`,
    activeMatch: orig.activeMatch ?? escapeRegExp(`/${orig.link}/`),
  }));

export default parseNav(nav);
