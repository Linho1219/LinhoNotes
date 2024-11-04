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
import { useData } from "vitepress";
const { isDark } = useData();
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

onMounted(
  () =>
    import.meta.env.SSR ||
    watchEffect(() => {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark.value ? "dark" : "neutral",
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
    })
);
</script>

<style>
.mermaid svg {
  margin: 0 auto;
}
.mermaid-error pre {
  white-space: pre-wrap;
}
</style>
