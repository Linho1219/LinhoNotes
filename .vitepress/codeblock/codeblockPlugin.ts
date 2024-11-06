import type MarkdownIt from "markdown-it";

export default function mdPlot(md: MarkdownIt): void {
  const fence = md.renderer.rules.fence?.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const language = token.info.trim();

    if (language.startsWith("mermaid"))
      return `<Mermaid id="mermaid-${idx}" code="${encodeURIComponent(
        token.content
      )}"></Mermaid>`;
    if (language.startsWith("graph"))
      return `<Graph id="funcion-${idx}" code="${encodeURIComponent(
        token.content
      )}"></Graph>`;
    return fence(tokens, idx, options, env, self);
  };
}
