import type MarkdownIt from "markdown-it";

export default function mdImageViewer(md: MarkdownIt): void {
  md.renderer.rules.image = function (tokens, idx, options, env, slf) {
    const token = tokens[idx];
    const alt = slf.renderInlineAsText(token.children!, options, env),
      src = token.attrs?.find(([attr]) => attr === "src")?.[1];
    token.attrs![token.attrIndex("alt")][1] = alt;
    return `<ImageWrapper src="${src}" alt="${alt}" />`;
  };
}
