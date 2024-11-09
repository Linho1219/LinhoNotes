import type MarkdownIt from "markdown-it";

export default function mdAdjustSpacing(md: MarkdownIt) {
  const mathorig = md.renderer.rules.math_inline!;
  md.renderer.rules.math_inline = (...args) => "\u200e" + mathorig(...args) + "\u200e";

  const codeorig = md.renderer.rules.code_inline!;
  md.renderer.rules.code_inline = (...args) => "\u200e" + codeorig(...args) + "\u200e";
}
