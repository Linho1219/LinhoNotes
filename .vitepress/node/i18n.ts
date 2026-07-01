import type { DefaultTheme } from "vitepress";

/** 通过作为 VitePress themeConfig 的属性传入的文本翻译 */
export const themeI18n: DefaultTheme.Config = {
  docFooter: {
    prev: "上一篇",
    next: "下一篇",
  },
  darkModeSwitchLabel: "外观",
  lightModeSwitchTitle: "切换到浅色模式",
  darkModeSwitchTitle: "切换到深色模式",
  returnToTopLabel: "返回顶部",
  sidebarMenuLabel: "项目目录",
  notFound: {
    quote:
      "仓库中找不到这个页面。但你可以点击右上角的 GitHub 图标加入我们，一起为仓库添砖加瓦！",
    linkText: "返回首页",
    linkLabel: "返回首页",
  },
} as const;

/** 其他杂七杂八的文本翻译 */
export const miscI18n = {
  editLink: "在 GitHub 上查看此页",
  outline: "本页大纲",
  lastUpdated: "最后更新于",
  searchPlaceHolder: "输入关键词",
  searchBtnText: "搜索",
  share: "分享",
} as const;

/** Algolia DocSearch 搜索框的文本翻译 */
export const searchI18n: DefaultTheme.AlgoliaSearchOptions["translations"] = {
  button: {
    buttonText: "搜索", // Search
    buttonAriaLabel: "搜索", // Search
  },
  modal: {
    startScreen: {
      recentSearchesTitle: "最近", // Recent
      noRecentSearchesText: "无历史纪录", // No recent searches
      saveRecentSearchButtonTitle: "固定关键词", // Save this search
      removeRecentSearchButtonTitle: "从历史记录中移除", // Remove this search from history
      favoriteSearchesTitle: "收藏", // Favorite
      removeFavoriteSearchButtonTitle: "从收藏夹中移除", // Remove this search from favorites
    },
    errorScreen: {
      titleText: "无法获取结果", // Unable to fetch results
      helpText: "请检查网络连接", // You might want to check your network connection.
    },
    footer: {
      selectText: "选择", // to select
      selectKeyAriaLabel: "Enter 键", // Enter key
      navigateText: "导航", // to navigate
      navigateUpKeyAriaLabel: "上箭头", // Arrow up
      navigateDownKeyAriaLabel: "下箭头", // Arrow down
      closeText: "清空", // to close
      closeKeyAriaLabel: "Esc 键", // Escape key
    },
    noResultsScreen: {
      noResultsText: "未找到", // No results for
      suggestedQueryText: "尝试搜索", // Try searching for
      reportMissingResultsText: "有遗漏？", // Believe this query should return results?
      reportMissingResultsLinkText: "反馈问题", // Let us know.
    },
  },
} as const;
