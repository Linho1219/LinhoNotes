/** 站点配置 */
export const globalConfig: GlobalConfig = {
  title: "LinhoNotes",
  description: "一个笔记仓库",
  baseUrl: "https://notes.linho.cc",
  owner: "Linho1219",
  repo: "LinhoNotes",
} as const;

/** 顶部导航栏配置 */
export const nav: Nav = [
  { text: "高数", link: "高等数学" },
  { text: "线代", link: "线性代数" },
  { text: "RM", link: "机甲大师" },
  { text: "JS", link: "JavaScript 教程" },
  { text: "C++", link: "C-C++ 相关" },
  { text: "算法", link: "算法相关" },
  { text: "指南", link: "仓库贡献指南" },
] as const;

/** 侧边栏配置 */
export const sidebarConfig: SidebarConfig = {
  ignProjects: [".vitepress", ".github", ".git", "node_modules", "public"],
  ignDirs: ["images"],
  ignFiles: ["index.md"],
  maxDepth: 2,
};

/** 贡献者清单 */
export const fullContributorList: Contributor[] = [
  {
    nickname: "Linho",
    username: "Linho1219",
    emailHash: ["81c7445a52", "0c5b28c9ad"],
  },
  {
    nickname: "Horrible",
    username: "Horrible120",
    emailHash: ["fcf0370694", "f408246931"],
  },
  {
    nickname: "GBY.",
    username: "SkinCrab",
    emailHash: ["7368906deb"],
  },
  {
    nickname: "Acha",
    username: "acha666",
    emailHash: ["d772a76fa1", "15e5ea97d8"],
  },
  {
    nickname: "Cindy Fang",
    username: "CindyFang0716",
    emailHash: ["2e08b8e801"],
  },
  {
    nickname: "LRJ",
    username: "Su-Zi-Zhan",
    emailHash: ["18c6a8f3f6"],
  },
];

/*===== 类型定义 =====*/

type GlobalConfig = {
  /** 网站标题 */
  title: string;
  /** 网站描述 */
  description: string;
  /** 网站地址 */
  baseUrl: `https://${string}`;
  /** 仓库所有者用户名 */
  owner: string;
  /** 仓库名 */
  repo: string;
};

export type Nav = {
  text: string;
  link: string;
  /** 链接高亮匹配正则 */
  activeMatch?: string;
}[];

export type Contributor = {
  /** Github 昵称 */
  nickname: string;
  /** Github 用户名（链接地址） */
  username: string;
  /** Git 邮箱哈希值前 10 位 */
  emailHash: string[];
};

type SidebarConfig = {
  /** 根目录下忽略的目录名称 */
  ignProjects: string[];
  /** 全局忽略的目录名称 */
  ignDirs: string[];
  /** 全局忽略的文件名称 */
  ignFiles: string[];
  /** 侧边栏目录最大递归层数 */
  maxDepth: number;
};
