import { DefaultTheme } from "vitepress";
import { miscI18n } from "../i18n";

export type Nav = {
  text: string;
  link: string;
  /** 链接高亮匹配正则 */
  activeMatch?: string;
}[];

export const nav: Nav = [
  { text: "高数", link: "高等数学" },
  { text: "线代", link: "线性代数" },
  { text: "RM", link: "机甲大师" },
  { text: "C++", link: "C-C++相关" },
  { text: "前端", link: "前端相关" },
  { text: "算法", link: "算法相关" },
  { text: "指南", link: "仓库贡献指南" },
] as const;

const escapeRegExp = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseNav = (orig: Nav): DefaultTheme.NavItem[] => [
  ...orig.map((orig) => ({
    text: orig.text,
    link: `/${orig.link}/`,
    activeMatch: orig.activeMatch ?? escapeRegExp(`/${orig.link}/`),
  })),
  { component: "NavDivider" },
  {
    text: miscI18n.share,
    items: [{ component: "Share" }],
  },
];

export default parseNav(nav);
