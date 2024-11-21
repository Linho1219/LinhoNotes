import { DefaultTheme } from "vitepress";
import { nav } from "../manualConfig";
import type { Nav } from "../manualConfig";

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
    text: "分享",
    items: [{ component: "Share" }],
  },
];

export default parseNav(nav);
