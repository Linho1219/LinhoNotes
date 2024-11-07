import type MarkdownIt from "markdown-it";

export default function mdPlot(md: MarkdownIt): void {
  const fence = md.renderer.rules.fence?.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const language = token.info.trim();

    if (language.startsWith("mermaid"))
      return `<ClientOnly><Mermaid id="mermaid-${idx}" code="${encodeURIComponent(
        token.content
      )}"></Mermaid></ClientOnly>`;
    if (language.startsWith("graph"))
      return `<ClientOnly><Graph id="funcion-${idx}" code="${encodeURIComponent(
        token.content
      )}"></Graph></ClientOnly>`;
    return fence(tokens, idx, options, env, self);
  };
}
