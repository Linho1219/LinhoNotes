import type MarkdownIt from "markdown-it";

export default function mdImageViewer(md: MarkdownIt) {
  const orig = md.renderer.rules.image!;
  function putErr(str: string) {
    if (process.env.NODE_ENV === "production") throw new Error(str);
    console.error(str);
  }
  md.renderer.rules.image = (tokens, idx, options, env, slf) => {
    if (tokens[idx].attrs)
      tokens[idx].attrs.forEach(([attr, value]) => {
        if (attr !== "src") return;
        value = decodeURI(value);
        if (value.match(/[A-Za-z]:\\/))
          putErr(`Bad image URI: Use relative path instead\n  Src: ${value}`);
        if (value.includes("\\"))
          putErr(`Bad image URI: Please use "/" instead of "\\"\n  Src:${value}`);
      });
    return `<ClientOnly><ImageWrapper ${
      tokens[idx - 1]?.type === "text" || tokens[idx + 1]?.type === "text"
        ? "inline"
        : ""
    }>${orig(tokens, idx, options, env, slf)}</ImageWrapper></ClientOnly>`;
  };
}
