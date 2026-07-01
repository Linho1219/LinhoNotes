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
import "./styles/mojikumi.css";

import "./fonts/JetBrainsMono/index.css";
import "./fonts/HarmonyOSSans/index.css";
import "./fonts/PunctuationSC/index.css";

import Layout from "./layout.vue";
import Mermaid from "@components/mermaid.vue";
import Plot from "@features/plot/plot.vue";
import Tag from "@components/tag.vue";
import Share from "@features/short-url/share.vue";
import NavDivider from "@components/nav-divider.vue";
import Cadpa from "@components/cadpa.vue";
import Pinyin from "@components/pinyin.vue";
import Cloze from "@components/cloze.vue";
import Baseline from "@features/baseline/baseline.vue";
import Footnote from "@features/footnote/footnote.vue";
import FootnoteRef from "@features/footnote/footnote-ref.vue";
import ImageWrapper from "@features/image-viewer/image-wrapper.vue";
import GeoGebra from "@features/geogebra/geogebra.vue";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp: async ({ app }) => {
    app.component("Mermaid", Mermaid);
    app.component("Plot", Plot);
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
  },
} satisfies Theme;
