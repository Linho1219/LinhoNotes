import type MarkdownIt from "markdown-it";

export default function mdEquationSpacing(md: MarkdownIt) {
  const orig = md.renderer.rules.math_inline;
  md.renderer.rules.math_inline = (...args) => "\u200e" + orig!(...args) + "\u200e";
}
