<template>
  <div class="mermaid">
    <div
      v-if="!errorFlag"
      class="mermaid_container viewer-trigger"
      v-html="svgRef"
      @click="viewerOpened = true"
    ></div>
    <Teleport to="body">
      <ImageViewer
        :svg="svgRef"
        alt=""
        :initWidth="initWidth"
        :initHeight="initHeight"
        :display="viewerOpened"
        @close="viewerOpened = false"
      />
    </Teleport>
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
const props = defineProps({
  id: String,
  code: String,
});

import { ref } from "vue";
import mermaid from "mermaid";
import ImageViewer from "../imageViewer/imageViewer.vue";

const svgRef = ref(""),
  errorFlag = ref(false),
  errorDetails = ref("");
const viewerOpened = ref(false);
const initWidth = ref(0),
  initHeight = ref(0);

const code = decodeURIComponent(props.code!);

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  fontFamily: "var(--vp-font-family-base)",
});
mermaid.render(props.id!, code).then(
  (result) => {
    svgRef.value = result.svg;
    const viewBox = <[number, number, number, number]>result.svg
      .match(/viewBox="([^"]+)"/)![1]
      .split(" ")
      .map((num) => Number(num));
    initWidth.value = viewBox[2];
    initHeight.value = viewBox[3];
  },
  (error) => {
    errorFlag.value = true;
    errorDetails.value = error.toString();
    console.error(error);
  }
);
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
  filter: invert() hue-rotate(180deg) contrast(80%) brightness(120%);
}
</style>
