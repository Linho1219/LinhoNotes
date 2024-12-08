import type MarkdownIt from "markdown-it";
import prettier from "@prettier/sync";
import { execSync } from "child_process";

const prettierTable = {
  ts: "ts",
  typescript: "ts",
  js: "babel",
  javascript: "babel",
  css: "css",
  scss: "scss",
  less: "less",
  json: "json",
  json5: "json5",
  jsonc: "jsonc",
  markdown: "markdown",
  md: "markdown",
  html: "html",
  vue: "vue",
  angular: "angular",
  yaml: "yaml",
} as const;
const clangs = ["c", "c++", "cpp", "cxx"];

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

    // 代码格式化
    if (prettierTable[language]) {
      try {
        token.content = prettier.format(token.content, {
          parser: prettierTable[language],
          printWidth: 75,
        });
      } catch (err) {
        if (process.env.NODE_ENV !== "production")
          console.warn("\nIllegal code:", err.message);
      }
    }
    if (clangs.includes(language.toLowerCase())) {
      try {
        const formatted = execSync(
          `clang-format -style="{BasedOnStyle: llvm, IndentWidth: 4, ColumnLimit: 75}"`,
          {
            input: token.content,
            encoding: "utf-8",
          }
        );
        token.content = formatted;
      } catch (err) {
        if (process.env.NODE_ENV !== "production")
          console.warn("\nIllegal code", err.message);
      }
    }
    return fence(tokens, idx, options, env, self);
  };
}
