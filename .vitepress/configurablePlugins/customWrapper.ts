// Code modified from markdown-it/markdown-it-mark

import type MarkdownIt from "markdown-it";
import { StateInline } from "markdown-it/index.js";

interface customWrapperOptions {
  marker: string;
  tag: string;
  typeName?: string;
}

export default function ins_plugin(
  md: MarkdownIt,
  options: customWrapperOptions
) {
  const {
    marker: MARKER,
    tag: TAG,
    typeName: TYPE = TAG.toLowerCase(),
  } = options;
  const MARKUP = MARKER.repeat(2);
  const MARK = MARKER.charCodeAt(0);

  // Insert each marker as a separate text token, and add it to delimiter list
  //
  function tokenize(state: StateInline, silent: boolean) {
    const start = state.pos;
    const marker = state.src.charCodeAt(start);

    if (silent) {
      return false;
    }

    if (marker !== MARK) {
      return false;
    }

    const scanned = state.scanDelims(state.pos, true);
    let len = scanned.length;
    const ch = String.fromCharCode(marker);

    if (len < 2) {
      return false;
    }

    if (len % 2) {
      const token = state.push("text", "", 0);
      token.content = ch;
      len--;
    }

    for (let i = 0; i < len; i += 2) {
      const token = state.push("text", "", 0);
      token.content = ch + ch;

      if (!scanned.can_open && !scanned.can_close) {
        continue;
      }

      state.delimiters.push({
        marker,
        length: 0, // disable "rule of 3" length checks meant for emphasis
        // jump: i / 2, // 1 delimiter = 2 characters
        token: state.tokens.length - 1,
        end: -1,
        open: scanned.can_open,
        close: scanned.can_close,
      });
    }

    state.pos += scanned.length;

    return true;
  }

  // Walk through delimiter list and replace text tokens with tags
  //
  function postProcess(
    state: StateInline,
    delimiters: StateInline.Delimiter[]
  ) {
    const loneMarkers: number[] = [];
    const max = delimiters.length;

    for (let i = 0; i < max; i++) {
      const startDelim = delimiters[i];

      if (startDelim.marker !== MARK) {
        continue;
      }

      if (startDelim.end === -1) {
        continue;
      }

      const endDelim = delimiters[startDelim.end];

      const token_o = state.tokens[startDelim.token];
      token_o.type = TYPE + "_open";
      token_o.tag = TAG;
      token_o.nesting = 1;
      token_o.markup = MARKUP;
      token_o.content = "";

      const token_c = state.tokens[endDelim.token];
      token_c.type = TYPE + "_close";
      token_c.tag = TAG;
      token_c.nesting = -1;
      token_c.markup = MARKUP;
      token_c.content = "";

      if (
        state.tokens[endDelim.token - 1].type === "text" &&
        state.tokens[endDelim.token - 1].content === MARKER
      ) {
        loneMarkers.push(endDelim.token - 1);
      }
    }

    // If a marker sequence has an odd number of characters, it's splitted
    // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
    // start of the sequence.
    //
    // So, we have to move all those markers after subsequent s_close tags.
    //
    while (loneMarkers.length) {
      const i = loneMarkers.pop()!;
      let j = i + 1;

      while (
        j < state.tokens.length &&
        state.tokens[j].type === "cloze_close"
      ) {
        j++;
      }

      j--;

      if (i !== j) {
        const token = state.tokens[j];
        state.tokens[j] = state.tokens[i];
        state.tokens[i] = token;
      }
    }
  }

  md.inline.ruler.before("emphasis", TAG, tokenize);
  md.inline.ruler2.before("emphasis", TAG, (state) => {
    const tokenMetaArr = state.tokens_meta ?? [];
    postProcess(state, state.delimiters);
    for (const tokenMeta of tokenMetaArr) {
      if (tokenMeta && tokenMeta.delimiters) {
        postProcess(state, tokenMeta.delimiters);
      }
    }
    return true;
  });
}
