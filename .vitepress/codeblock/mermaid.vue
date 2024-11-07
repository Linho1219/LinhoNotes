<template>
  <div class="mermaid">
    <div v-if="!errorFlag" class="mermaid_container" v-html="svgRef"></div>
    <div
      v-if="errorFlag"
      class="mermaid-error caution custom-block github-alert"
    >
      <p class="custom-block-title">Mermaid 渲染错误</p>
      <pre v-html="errorDetails"></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference path="../types.d.ts" />

const props = defineProps({
  id: String,
  code: String,
});

import { ref, onMounted, watchEffect } from "vue";
import mermaid from "mermaid";

const svgRef = ref(""),
  errorFlag = ref(false),
  errorDetails = ref("");

const code = decodeURIComponent(props.code!);

if (!import.meta.env.SSR) {
  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    fontFamily: "var(--vp-font-family-base)",
  });
  mermaid.render(props.id!, code).then(
    (result) => {
      svgRef.value = result.svg;
    },
    (error) => {
      errorFlag.value = true;
      errorDetails.value = error.toString();
      console.error(error);
    }
  );
}
</script>

<style>
.mermaid svg {
  margin: 0 auto;
}
.mermaid_container,
.mermaid_container p {
  line-height: 1.5em !important;
  user-select: none;
}
.mermaid-error pre {
  white-space: pre-wrap;
}
.dark .mermaid_container {
  filter: invert() contrast(80%);
  text-shadow: #fff 0 0 3px, #fff 0 0 8px;
}
.dark .mermaid_container text {
  fill: #000 !important;
}
</style>
