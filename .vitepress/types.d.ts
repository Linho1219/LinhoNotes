declare module "markdown-it-task-lists" {
  import type MarkdownIt from "markdown-it";
  function mdCheckbox(md: MarkdownIt): void;
  export default mdCheckbox;
}
