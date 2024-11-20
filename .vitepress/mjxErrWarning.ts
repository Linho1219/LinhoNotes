import type MarkdownIt from "markdown-it";

export default function mdMjxErrWarning(md: MarkdownIt) {
  const orig = md.renderer.rules.math_block;
  if (typeof orig !== "function")
    throw new Error(
      "Mathblock rule not found. Do not use mdMjxErrWarning without Mathjax."
    );
  md.renderer.rules.math_block = (tokens, idx, options, env, self) => {
    const orignalCode = orig(tokens, idx, options, env, self);
    const error = orignalCode.match(/data-mjx-error="([^"]+)"/)?.[1];
    if (error) {
      if (process.env.NODE_ENV !== "production")
        return `<div class="graph-error caution custom-block github-alert"><p class="custom-block-title">公式渲染错误</p><pre>${error}</pre></div>`;
      else throw new Error("LaTeX Render Error: " + error);
    }
    return orignalCode;
  };
}
