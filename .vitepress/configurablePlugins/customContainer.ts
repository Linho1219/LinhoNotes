import container from "markdown-it-container";
import type MarkdownIt from "markdown-it";
import { RenderRule } from "markdown-it/lib/renderer.mjs";
import { PluginWithParams } from "markdown-it";

type ContainerArgs = [PluginWithParams, string, { render: RenderRule }];

type CustomContainerConfig = {
  numbered?: boolean;
  themeAlias?: string[];
};

const giveNumber = (arr: any[], item: any) =>
  arr.length === 1 ? "" : " " + (arr.indexOf(item) + 1);

export const createContainer = (
  klass: string,
  defaultTitle: string,
  config: CustomContainerConfig,
  md: MarkdownIt,
): ContainerArgs => [
  container as unknown as PluginWithParams,
  klass,
  {
    render(tokens, idx, _options, env: { references?: any }) {
      const token = tokens[idx];
      const info = token.info.trim().slice(klass.length).trim();
      const attrs = md.renderer.renderAttrs(token);
      if (token.nesting === 1) {
        let rawTitle: string;
        if (config.numbered) {
          rawTitle = info
            ? info +
              giveNumber(
                tokens.filter(
                  (item) =>
                    item.info.trim().startsWith(klass) &&
                    item.info.trim().slice(klass.length).trim() === info,
                ),
                token,
              )
            : defaultTitle +
              giveNumber(
                tokens.filter((item) => item.info.trim() === klass),
                token,
              );
        } else rawTitle = info || defaultTitle;
        const title = md.renderInline(rawTitle, {
          references: env.references,
        });
        return `<div class="${klass} ${
          config.themeAlias?.join(" ") ?? ""
        } custom-block"${attrs}><p class="custom-block-title">${title}</p>\n`;
      } else return `</div>\n`;
    },
  },
];
