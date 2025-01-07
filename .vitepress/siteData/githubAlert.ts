/* 替换原本的 GFM 提示框处理组件，使得 */

import type MarkdownIt from "markdown-it";

const markerRE =
  /^\[\!(TIP|NOTE|INFO|IMPORTANT|WARNING|CAUTION|DANGER)\]([^\n\r]*)/i;

export default function mdGitHubAlertsPlugin(md: MarkdownIt) {
  const titleMark = {
    tip: "TIP",
    note: "NOTE",
    info: "INFO",
    important: "IMPORTANT",
    warning: "WARNING",
    caution: "CAUTION",
    danger: "DANGER",
  } as Record<string, string>;

  md.core.ruler.after("block", "github-alerts", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "blockquote_open") {
        const startIndex = i;
        const open = tokens[startIndex];
        let endIndex = i + 1;
        while (
          endIndex < tokens.length &&
          (tokens[endIndex].type !== "blockquote_close" ||
            tokens[endIndex].level !== open.level)
        )
          endIndex++;
        if (endIndex === tokens.length) continue;
        const close = tokens[endIndex];
        const firstContent = tokens
          .slice(startIndex, endIndex + 1)
          .find((token) => token.type === "inline");
        if (!firstContent) continue;
        const match = firstContent.content.match(markerRE);
        if (!match) continue;
        const secondContent = tokens.slice(startIndex, endIndex + 1).find(
          (() => {
            let flag = 0;
            return (token) => token.type === "inline" && flag++;
          })()
        );
        const secondTitle = secondContent?.content
          .trim()
          .match(/^\*\*([^*]+)\*\*$/)?.[1];
        const type = match[1].toLowerCase();
        const title =
          secondTitle ??
          (match[2].trim() || titleMark[type] || capitalize(type));
        firstContent.content = firstContent.content
          .slice(match[0].length)
          .trimStart();
        if (secondTitle) secondContent.content = "";
        open.type = "github_alert_open";
        open.tag = "div";
        open.meta = {
          title,
          type,
        };
        close.type = "github_alert_close";
        close.tag = "div";
      }
    }
  });
  md.renderer.rules.github_alert_open = function (tokens, idx, _options, env) {
    const { title, type } = tokens[idx].meta;
    const attrs = "";
    return `<div class="${type} custom-block github-alert"${attrs}><p class="custom-block-title">${md.renderInline(
      title,
      { references: env.references }
    )}</p>\n`;
  };
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
