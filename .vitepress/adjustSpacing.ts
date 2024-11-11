import type MarkdownIt from "markdown-it";
import type { Token } from "markdown-it/index.js";
import pangu from "pangu";

function getPrevChar(tokens: Token[], index: number) {
  for (let i = index - 1; i >= 0; i--) {
    const { content, type } = tokens[i];
    if (type === "html_inline") return "";
    if (content && content.length) return content.slice(-1)!;
  }
  return "";
}

const escapeHtml = (str: string) =>
  str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// 正则表达式来自 赫蹏增强脚本 https://github.com/sivan/heti
const REG_BD_STOP = `。．，、：；！‼？⁇`;
const REG_BD_SEP = `·・‧`;
const REG_BD_OPEN = `「『（《〈【〖〔［｛`;
const REG_BD_CLOSE = `」』）》〉】〗〕］｝`;
const REG_BD_START = `${REG_BD_OPEN}${REG_BD_CLOSE}`;
const REG_BD_END = `${REG_BD_STOP}${REG_BD_OPEN}${REG_BD_CLOSE}`;
const REG_BD_HALF_OPEN = `“‘`;
const REG_BD_HALF_CLOSE = `”’`;
const REG_BD_HALF_START = `${REG_BD_HALF_OPEN}${REG_BD_HALF_CLOSE}`;

const getWrapper = (classList: string, text: string) =>
  `<punc-spacing class="${classList}">${text}</punc-spacing>`;

const punctuationAdjust = (str: string) =>
  str
    .replace(
      new RegExp(
        `([${REG_BD_STOP}])(?=[${REG_BD_START}])|([${REG_BD_OPEN}])(?=[${REG_BD_OPEN}])|([${REG_BD_CLOSE}])(?=[${REG_BD_END}])`,
        "g"
      ),
      (substr) => getWrapper("punc-half", substr)
    )
    .replace(
      new RegExp(
        `([${REG_BD_SEP}])(?=[${REG_BD_OPEN}])|([${REG_BD_CLOSE}])(?=[${REG_BD_SEP}])`,
        "g"
      ),
      (substr) => getWrapper("punc-quarter", substr)
    )
    .replace(
      new RegExp(
        `([${REG_BD_STOP}])(?=[${REG_BD_HALF_START}])|([${REG_BD_HALF_OPEN}])(?=[${REG_BD_OPEN}])`,
        "g"
      ),
      (substr) => getWrapper("punc-quarter", substr)
    );

const punctuationAdjustStart = (str: string) =>
  str.replace(new RegExp(`^[${REG_BD_OPEN}]`), (substr) =>
    getWrapper("punc-before-half", substr)
  );

export default function mdAdjustSpacing(md: MarkdownIt) {
  md.renderer.rules.text = (tokens, index) => {
    const prevChar = getPrevChar(tokens, index);
    const result = punctuationAdjust(
      escapeHtml(
        pangu.spacing(prevChar + tokens[index].content).slice(prevChar.length)
      )
    );
    if (typeof tokens[index - 1] === "undefined")
      return punctuationAdjustStart(result);
    else return result;
  };

  const panguItems = ["code_inline", "math_inline"];
  panguItems.forEach((item) => {
    const orig = md.renderer.rules[item];
    if (typeof orig !== "function") throw new Error("未定义的 Pangu 对象");
    md.renderer.rules[item] = (tokens, index, options, env, self) => {
      const content = tokens[index].content || "";
      const prevChar = getPrevChar(tokens, index);
      const prefix = pangu
        .spacing(prevChar + content.charAt(0))
        .slice(prevChar.length, -1);
      return prefix + orig(tokens, index, options, env, self);
    };
  });
}
