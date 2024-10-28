export const themeI18n = {
  docFooter: {
    prev: "上一篇",
    next: "下一篇",
  },
  darkModeSwitchLabel: "外观",
  lightModeSwitchTitle: "切换到浅色模式",
  darkModeSwitchTitle: "切换到深色模式",
  returnToTopLabel: "返回顶部",
  sidebarMenuLabel: "项目目录",
} as const;

export const miscI18n = {
  editLink: "在 Github 上查看此页",
  outline: "本页大纲",
  lastUpdated: "最后更新于",
  searchPlaceHolder: "输入关键词",
  searchBtnText: "搜索",
} as const;

export const searchI18n = {
  button: {
    buttonText: "搜索",
    buttonAriaLabel: "搜索",
  },
  modal: {
    searchBox: {
      resetButtonTitle: "清空",
      resetButtonAriaLabel: "清空",
      cancelButtonText: "取消",
      cancelButtonAriaLabel: "取消",
      searchInputLabel: "搜索",
    },
    startScreen: {
      recentSearchesTitle: "最近",
      noRecentSearchesText: "无历史纪录",
      saveRecentSearchButtonTitle: "固定关键词",
      removeRecentSearchButtonTitle: "从历史记录中移除",
      favoriteSearchesTitle: "收藏",
      removeFavoriteSearchButtonTitle: "从收藏夹中移除",
    },
    errorScreen: {
      titleText: "无法获取结果",
      helpText: "请检查网络连接",
    },
    footer: {
      selectText: "选择",
      selectKeyAriaLabel: "Enter 键",
      navigateText: "导航",
      navigateUpKeyAriaLabel: "上箭头",
      navigateDownKeyAriaLabel: "下箭头",
      closeText: "关闭",
      closeKeyAriaLabel: "Esc 键",
      searchByText: "Search by",
    },
    noResultsScreen: {
      noResultsText: "找不到",
      suggestedQueryText: "尝试搜索",
      reportMissingResultsText: "",
      reportMissingResultsLinkText: "",
    },
  },
} as const;
