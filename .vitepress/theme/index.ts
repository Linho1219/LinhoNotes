import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import "virtual:group-icons.css";
import "katex/dist/katex.css";

import "./styles/private.scss";
import "./styles/fix.scss";
import "./styles/beautify.scss";
import "./styles/animation.scss";
import "./styles/home.scss";
import "./styles/print.scss";

import "./fonts/JetBrainsMono/index.css";
import "./fonts/HarmonyOSSans/index.css";
import "./fonts/PunctuationSC/index.css";

import "@/spacing/mojikumi.css";

import Layout from "./layout.vue";
import Mermaid from "@/codeblock/mermaid.vue";
import Graph from "@/codeblock/graph.vue";
import Tag from "./components/tag.vue";
import Share from "@/shortUrl/share.vue";
import NavDivider from "./components/navDivider.vue";
import Cadpa from "./components/cadpa.vue";
import Pinyin from "./components/pinyin.vue";
import Cloze from "./components/cloze.vue";
import Baseline from "./components/baseline.vue";
import Footnote from "@/footnote/footnote.vue";
import FootnoteRef from "@/footnote/footnoteRef.vue";
import ImageWrapper from "@/imageViewer/imageWrapper.vue";
import GeoGebra from "@/geogebra/geogebra.vue";

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
    app.component("Footnote", Footnote);
    app.component("FootnoteRef", FootnoteRef);
    app.component("ImageWrapper", ImageWrapper);
    app.component("CADPA", Cadpa);
    app.component("PY", Pinyin);
    app.component("Pinyin", Pinyin);
    app.component("Cloze", Cloze);
    app.component("Baseline", Baseline);
    app.component("GeoGebra", GeoGebra);
    app.component("GGB", GeoGebra);
  },
};
