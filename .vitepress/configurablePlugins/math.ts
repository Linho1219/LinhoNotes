import type MarkdownIt from "markdown-it";
import katex from "katex";
import "katex/contrib/mhchem";

const mathRenderMode = process.env.MATH_RENDER_MODE ?? "katex";

const macros = {
  "\\d": `\\mathrm d`,
  "\\dx": `\\mathrm dx`,
  "\\ddx": `\\frac{\\mathrm d}{\\mathrm dx}`,
  "\\ddy": `\\frac{\\mathrm d}{\\mathrm dy}`,
  "\\ddt": `\\frac{\\mathrm d}{\\mathrm dt}`,
};

const escape = (content: string) =>
  content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function isValidDelim(state: any, pos: number) {
  const max = state.posMax;
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
  const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;
  let canOpen = true;
  let canClose = true;

  if (
    prevChar === 0x20 ||
    prevChar === 0x09 ||
    (nextChar >= 0x30 && nextChar <= 0x39)
  ) {
    canClose = false;
  }
  if (nextChar === 0x20 || nextChar === 0x09) canOpen = false;

  return { canOpen, canClose };
}

function mathInline(state: any, silent: boolean) {
  if (state.src[state.pos] !== "$") return false;

  let res = isValidDelim(state, state.pos);
  if (!res.canOpen) {
    if (!silent) state.pending += "$";
    state.pos += 1;
    return true;
  }

  const start = state.pos + 1;
  let match = start;
  while ((match = state.src.indexOf("$", match)) !== -1) {
    let pos = match - 1;
    while (state.src[pos] === "\\") pos -= 1;
    if ((match - pos) % 2 === 1) break;
    match += 1;
  }

  if (match === -1) {
    if (!silent) state.pending += "$";
    state.pos = start;
    return true;
  }
  if (match - start === 0) {
    if (!silent) state.pending += "$$";
    state.pos = start + 1;
    return true;
  }

  res = isValidDelim(state, match);
  if (!res.canClose) {
    if (!silent) state.pending += "$";
    state.pos = start;
    return true;
  }

  if (!silent) {
    const token = state.push("math_inline", "math", 0);
    token.markup = "$";
    token.content = state.src.slice(start, match);
  }
  state.pos = match + 1;
  return true;
}

function mathBlock(state: any, start: number, end: number, silent: boolean) {
  let found = false;
  let pos = state.bMarks[start] + state.tShift[start];
  let max = state.eMarks[start];
  let lastLine = "";

  if (pos + 2 > max || state.src.slice(pos, pos + 2) !== "$$") return false;
  pos += 2;

  let firstLine = state.src.slice(pos, max);
  if (silent) return true;

  if (firstLine.trim().slice(-2) === "$$") {
    firstLine = firstLine.trim().slice(0, -2);
    found = true;
  }

  let next = start;
  for (; !found;) {
    next++;
    if (next >= end) break;
    pos = state.bMarks[next] + state.tShift[next];
    max = state.eMarks[next];
    if (pos < max && state.tShift[next] < state.blkIndent) break;
    if (state.src.slice(pos, max).trim().slice(-2) === "$$") {
      const lastPos = state.src.slice(0, max).lastIndexOf("$$");
      lastLine = state.src.slice(pos, lastPos);
      found = true;
    }
  }

  state.line = next + 1;
  const token = state.push("math_block", "math", 0);
  token.block = true;
  token.content =
    (firstLine && firstLine.trim() ? firstLine + "\n" : "") +
    state.getLines(start + 1, next, state.tShift[start], true) +
    (lastLine && lastLine.trim() ? lastLine : "");
  token.map = [start, state.line];
  token.markup = "$$";
  return true;
}

const renderKatex = (content: string, displayMode: boolean) => {
  try {
    return katex
      .renderToString(content, {
        displayMode,
        macros,
        output: "html",
        strict: false,
        throwOnError: true,
        trust: false,
      })
      .replace(/(?<=<span)(?=[^>]*class="katex")/, " v-pre ");
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    const message = error instanceof Error ? error.message : String(error);
    return displayMode
      ? `<div class="graph-error caution custom-block github-alert"><p class="custom-block-title">公式渲染错误</p><pre v-pre>${escape(message)}</pre></div>`
      : `<code v-pre class="graph-error caution custom-block github-alert">LaTeX Error: ${escape(message)}</code>`;
  }
};

const renderSource = (content: string, displayMode: boolean) =>
  displayMode
    ? `<div v-pre class="math math-block">${escape(content)}</div>`
    : `<span v-pre class="math math-inline">${escape(content)}</span>`;

export default function mdMath(md: MarkdownIt) {
  md.inline.ruler.after("escape", "math_inline", mathInline);
  md.block.ruler.after("blockquote", "math_block", mathBlock, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });

  md.renderer.rules.math_inline = (tokens, idx) =>
    mathRenderMode === "source"
      ? renderSource(tokens[idx].content, false)
      : renderKatex(tokens[idx].content, false);

  md.renderer.rules.math_block = (tokens, idx) =>
    mathRenderMode === "source"
      ? renderSource(tokens[idx].content, true)
      : renderKatex(tokens[idx].content, true);
}
