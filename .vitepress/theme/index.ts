import DefaultTheme from "vitepress/theme";
import "./fix.css";
import Layout from "./layout.vue";

export default {
  extends: DefaultTheme,
  Layout,
};
