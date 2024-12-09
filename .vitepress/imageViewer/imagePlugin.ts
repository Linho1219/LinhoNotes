import type MarkdownIt from "markdown-it";

export default function mdImageViewer(md: MarkdownIt): void {
  const orig = md.renderer.rules.image!;
  md.renderer.rules.image = function (tokens, idx, options, env, slf) {
    return `<ImageWrapper ${tokens[idx - 1]?.type === "text" && tokens[idx + 1]?.type === "text" ? "inline" : ""}>${orig(tokens, idx, options, env, slf)}</ImageWrapper>`;
  };
}
