import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import "./private.css";
import "./fix.css";
import "./beautify.css";
import "./animation.css";
import "./home.css";

import Layout from "./layout.vue";
import Mermaid from "../codeblock/mermaid.vue";
import Graph from "../codeblock/graph.vue";
import Tag from "./tag.vue";
import Share from "../shortUrl/share.vue";
import NavDivider from "./navDivider.vue";

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
