import type MarkdownIt from "markdown-it";
import type { Token } from "markdown-it/index.js";
import pangulib from "pangu";

function getPrevChar(tokens: Token[], index: number) {
  for (let i = index - 1; i >= 0; i--) {
    const { content, type } = tokens[i];
    if (type === "html_inline") return "";
    if (content && content.length) return content.slice(-1)!;
  }
  return "";
}

const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// 正则表达式来自 赫蹏增强脚本 https://github.com/sivan/heti
const puncConfig: Record<string, string> = {
  stop: `。．，、：；！‼？⁇`,
  sep: `·・‧`,
  open: `「『（《〈【〖〔［｛`,
  close: `」』）》〉】〗〕］｝`,
  spaceleft: `「『（《〈【〖〔［｛`,
  spaceright: `。．，、：；！‼？⁇」』）》〉】〗〕］｝`,
  quoteopen: `“‘`,
  quoteclose: `”’`,
};

const allPunc = Object.values(puncConfig).join("");
const puncArrs: Record<string, string[]> = {};
for (const key in puncConfig) {
  puncArrs[key] = [...puncConfig[key]];
}

const getWrapper = (content: string, classList: string[]) =>
  `<punc-spacing
    class="${classList.map((cls) => "punc-" + cls).join(" ")}"
    char="${content}">${content}</punc-spacing>`;

const punctuationAdjust = (str: string) =>
  str.replace(new RegExp(`[${allPunc}]{2,}`, "g"), (match) => {
    return (
      "<punc-wrapper>" +
      [...match]
        .map((char) => {
          const classList: string[] = [];
          for (const key in puncArrs)
            if (puncArrs[key].includes(char)) classList.push(key);
          return getWrapper(char, classList);
        })
        .join("") +
      "</punc-wrapper>"
    );
  });

export default function mdAutoSpacing(md: MarkdownIt) {
  const spacingItems = ["code_inline", "math_inline"];
  md.renderer.rules.text = (tokens, index) => {
    let result: string;
    const prevChar = getPrevChar(tokens, index);
    result = punctuationAdjust(
      escapeHtml(
        pangulib
          .spacing(prevChar + tokens[index].content)
          .slice(prevChar.length)
      )
    );
    return result;
  };

  const trimStart: MarkdownIt.Renderer.RenderRule = (...args) => {
    const [tokens, idx, optn, , slf] = args;
    const firstChar = tokens[idx + 1].content.trimStart().slice(0, 1);
    if (puncArrs.spaceleft.includes(firstChar)) {
      console.log(tokens[idx + 1].content.trimStart().slice(0, 3));
      tokens[idx].attrSet("class", "paragraph-punc-start");
      tokens[idx].attrSet("char", firstChar);
    }
    return slf.renderToken(tokens, idx, optn);
  };
  md.renderer.rules.list_item_open = md.renderer.rules.paragraph_open =
    trimStart;

  spacingItems.forEach((item) => {
    const orig = md.renderer.rules[item];
    if (typeof orig !== "function") {
      console.error("找不到需要添加空格的 rule:", item);
      return;
    }
    md.renderer.rules[item] = (tokens, index, options, env, self) => {
      const content = tokens[index].content ?? "";
      const prevChar = getPrevChar(tokens, index);
      const prefix = pangulib
        .spacing(prevChar + (content.at(0) ?? ""))
        .slice(prevChar.length, -1);
      return prefix + orig(tokens, index, options, env, self);
    };
  });
}
