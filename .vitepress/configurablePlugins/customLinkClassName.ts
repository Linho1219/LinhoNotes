import type MarkdownIt from "markdown-it";

export default function addLinkClass(
  md: MarkdownIt,
  { className }: { className: string }
) {
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    if (!tokens[idx].attrGet("class")) tokens[idx].attrSet("class", className);
    return defaultRender(tokens, idx, options, env, self);
  };
}
