declare module "markdown-it-task-lists" {
  import type MarkdownIt from "markdown-it";
  export default function (md: MarkdownIt): void;
}

declare module "markdown-it-sup" {
  import type MarkdownIt from "markdown-it";
  export default function (md: MarkdownIt): void;
}

declare module "markdown-it-sub" {
  import type MarkdownIt from "markdown-it";
  export default function (md: MarkdownIt): void;
}

interface ImportMetaEnv {
  /** 应用运行的模式 */
  MODE: string;
  /** 部署应用时的基本 URL。由 `base` 配置项决定 */
  BASE_URL: string;
  /** 应用是否运行在生产环境 */
  PROD: boolean;
  /** 应用是否运行在开发环境 */
  DEV: boolean;
  /** 应用是否运行在 server 上 */
  SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
