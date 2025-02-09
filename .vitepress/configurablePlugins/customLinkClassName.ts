import type MarkdownIt from "markdown-it";

export default function addLinkClass(
  md: MarkdownIt,
  { className }: { className: string }
) {
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    tokens[idx].attrSet("class", className);
    return defaultRender(tokens, idx, options, env, self);
  };
}
