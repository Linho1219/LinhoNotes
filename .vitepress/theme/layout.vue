<template>
  <Layout>
    <template #doc-before>
      <Breadcrumb />
    </template>
    <template #doc-footer-before>
      <Contributors />
    </template>
    <template #layout-bottom>
      <SearchOverlay />
      <div id="imageViewers"></div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from "vitepress/theme-without-fonts";
import { nextTick, provide } from "vue";
import { useData, useRouter } from "vitepress";
import Breadcrumb from "./components/breadcrumb.vue";
import SearchOverlay from "./components/searchOverlay.vue";
import Contributors from "../contributors/contributors.vue";
const { Layout } = DefaultTheme;
const { isDark } = useData();

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async () => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;
  document.documentElement.animate(
    { opacity: isDark.value ? [1, 0] : [0, 1] },
    {
      duration: 600,
      easing: "ease-out",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
});

const router = useRouter();
router.onBeforeRouteChange = () => {
  document.body.parentElement?.classList.add("disable-scroll-transition");
  console.log("disable");
};
router.onAfterRouteChange = () => {
  document.body.parentElement?.classList.remove("disable-scroll-transition");
  console.log("enable");
};
</script>

<style>
html {
  scroll-behavior: smooth;
}
html.disable-scroll-transition {
  scroll-behavior: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}
::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}
</style>
