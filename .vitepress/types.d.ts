declare module "markdown-it-task-lists" {
  import type MarkdownIt from "markdown-it";
  function mdCheckbox(md: MarkdownIt): void;
  export default mdCheckbox;
}

declare module "markdown-it-mark" {
  import type MarkdownIt from "markdown-it";
  function mdMark(md: MarkdownIt): void;
  export default mdMark;
}