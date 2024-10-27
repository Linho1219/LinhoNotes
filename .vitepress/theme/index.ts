import type { Theme } from 'vitepress'
import DefaultTheme from "vitepress/theme";
import "./private.css";
import "./fix.css";
import "./beautify.css"
import "./animation.css"
import "./home.css"

import Layout from "./layout.vue";
import Mermaid from "../codeblock/mermaid.vue";
import Graph from '../codeblock/graph.vue';

export default <Theme>{
  extends: DefaultTheme,
  Layout,
  enhanceApp: async ({ app }) => {
    app.component('Mermaid', Mermaid);
    app.component('Graph',Graph)
  },
};
