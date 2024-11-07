import type MarkdownIt from "markdown-it";

export default function mdFootnotePlus(md: MarkdownIt) {
  md.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
    const id = slf.rules.footnote_anchor_name!(tokens, idx, options, env, slf);
    let refid = id;
    let caption = Number(tokens[idx].meta.id + 1).toString();
    if (tokens[idx].meta.subId > 0) {
      caption += `:${tokens[idx].meta.subId}`;
      refid += `:${tokens[idx].meta.subId}`;
    }
    return `<ClientOnly><FootnoteRef id="${id}" refid="${refid}" caption="${caption}" /></ClientOnly>`;
  };
  md.renderer.rules.footnote_open = (tokens, idx, options, env, slf) => {
    let id = slf.rules.footnote_anchor_name!(tokens, idx, options, env, slf);
    if (tokens[idx].meta.subId > 0) id += `:${tokens[idx].meta.subId}`;
    return `<ClientOnly><Footnote id=${id}>`;
  };
  md.renderer.rules.footnote_close = () => {
    return "</Footnote></ClientOnly>\n";
  };
  md.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
    let id = slf.rules.footnote_anchor_name!(tokens, idx, options, env, slf);
    if (tokens[idx].meta.subId > 0) id += `:${tokens[idx].meta.subId}`;
    return ` <a href="#fnref${id}" class="footnote-backref footnote-link escape-animate">\u21a9\uFE0E</a>`;
  };
}
