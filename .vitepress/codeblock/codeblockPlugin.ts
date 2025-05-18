import type MarkdownIt from "markdown-it";
import prettier from "@prettier/sync";
import { execSync } from "child_process";
import JSON5 from "json5";
import base64 from "base-64";
import fs from "fs";

const prettierTable: Record<string, string> = {
  ts: "typescript",
  typescript: "typescript",
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
};
const clangs = ["c", "c++", "cpp", "cxx"];

export default function mdPlot(md: MarkdownIt): void {
  const fence = md.renderer.rules.fence!.bind(md.renderer.rules)!;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const language = token.info.trim();
    if (language.startsWith("mermaid"))
      return `<ClientOnly><Mermaid id="mermaid-${idx}" code="${encodeURIComponent(
        token.content
      )}"></Mermaid></ClientOnly>`;
    if (language.startsWith("graph")) {
      try {
        JSON5.parse(token.content);
      } catch (e) {
        if (process.env.NODE_ENV === "production") throw e;
        else console.error("\nGraph parse error:\n  " + String(e));
      }
      return `<ClientOnly><Graph id="funcion-${idx}" code="${encodeURIComponent(
        token.content
      )}"></Graph></ClientOnly>`;
    }
    if (language.startsWith("ggb")) {
      // console.log(token);
      const [src, mode] = (<any>token).src as string[];
      try {
        const content = fs.readFileSync(src);
        return `<ClientOnly><GeoGebra data="${content.toString("base64")}" mode="${mode}"/></ClientOnly>`;
      } catch(err) {
        console.error(`\nGeoGebra parse error:\n  ${src}\n  ${String(err)}`);
        return `<div class="mermaid-error caution custom-block github-alert">
          <p class="custom-block-title">GeoGebra 导入错误</p>
          <pre>${String(err)}</pre>
        </div>`;
      }
    }

    // 代码格式化
    if (token.content.trimStart().startsWith("// [!code escape-format]\n")) {
      token.content = token.content.replace("// [!code escape-format]\n", "");
      return fence(tokens, idx, options, env, self);
    }
    if (prettierTable[language]) {
      try {
        token.content = prettier.format(token.content, {
          parser: prettierTable[language],
          printWidth: 76,
        });
      } catch (err) {
        if (process.env.NODE_ENV !== "production")
          console.warn("\nIllegal code:" + String(err));
      }
    } else if (clangs.includes(language.toLowerCase())) {
      try {
        const formatted = execSync(
          `clang-format -style="{BasedOnStyle: llvm, IndentWidth: 4, ColumnLimit: 75}"`,
          { input: token.content, encoding: "utf-8" }
        );
        token.content = formatted;
      } catch (err) {
        if (process.env.NODE_ENV !== "production")
          console.warn("\nIllegal code" + String(err));
      }
    }
    return fence(tokens, idx, options, env, self);
  };
}
