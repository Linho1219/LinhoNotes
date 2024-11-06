import type MarkdownIt from "markdown-it";

export default function mdFootnotePlus(md:MarkdownIt){
	md.renderer.rules.footnote_caption = (tokens, idx) => {
		let n = Number(tokens[idx].meta.id + 1).toString();
		if (tokens[idx].meta.subId > 0) n += `:${tokens[idx].meta.subId}`;
		return `${n}`;
	};
}