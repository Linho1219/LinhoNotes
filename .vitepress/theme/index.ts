import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import "./styles/private.css";
import "./styles/fix.css";
import "./styles/beautify.css";
import "./styles/animation.css";
import "./styles/home.css";

import Layout from "./layout.vue";
import Mermaid from "../codeblock/mermaid.vue";
import Graph from "../codeblock/graph.vue";
import Tag from "./components/tag.vue";
import Share from "../shortUrl/share.vue";
import NavDivider from "./components/navDivider.vue";

export default <Theme>{
  extends: DefaultTheme,
  Layout,
  enhanceApp: async ({ app }) => {
    app.component("Mermaid", Mermaid);
    app.component("Graph", Graph);
    app.component("T", Tag);
    app.component("Tag", Tag);
    app.component("NavDivider", NavDivider);
    app.component("Share", Share);
  },
};
