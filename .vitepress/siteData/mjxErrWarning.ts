import type MarkdownIt from "markdown-it";

export default function mdMjxErrWarning(md: MarkdownIt) {
  const origBlock = md.renderer.rules.math_block;
  if (typeof origBlock !== "function")
    throw new Error(
      "Mathblock rule not found. Do not use mdMjxErrWarning without Mathjax."
    );
  md.renderer.rules.math_block = (tokens, idx, options, env, self) => {
    const orignalCode = origBlock(tokens, idx, options, env, self);
    const error = orignalCode.match(/data-mjx-error="([^"]+)"/)?.[1];
    if (error) {
      if (process.env.NODE_ENV !== "production")
        return `<div class="graph-error caution custom-block github-alert"><p class="custom-block-title">公式渲染错误</p><pre>${error}</pre></div>`;
      else throw new Error("LaTeX Render Error: " + error);
    }
    return orignalCode;
  };

  const origInline = md.renderer.rules.math_inline;
  if (typeof origInline !== "function")
    throw new Error(
      "Mathblock rule not found. Do not use mdMjxErrWarning without Mathjax."
    );
  md.renderer.rules.math_inline = (tokens, idx, options, env, self) => {
    const orignalCode = origInline(tokens, idx, options, env, self);
    const error = orignalCode.match(/data-mjx-error="([^"]+)"/)?.[1];
    if (error) {
      if (process.env.NODE_ENV !== "production")
        return `<code class="graph-error caution custom-block github-alert">LaTeX Error: ${error}</code>`;
      else throw new Error("LaTeX Render Error: " + error);
    }
    return orignalCode;
  };
}
