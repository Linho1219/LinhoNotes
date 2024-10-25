<template>
  <div
    v-if="!errorFlag"
    class="graph-container"
    ref="plotRef"
    :class="isDark ? 'graph-dark' : 'graph-light'"
  ></div>
  <div v-if="errorFlag" class="graph-err caution custom-block github-alert">
    <p class="custom-block-title">函数渲染错误</p>
    <pre v-html="errorDetails"></pre>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import functionPlot from "./function-plot/src/index";
import yaml from "js-yaml";
import { useData } from "vitepress";
const { isDark } = useData();

const props = defineProps({
  id: String,
  code: String,
  graphWidth: Number,
  graphHeight: Number,
});

const plotRef = ref<HTMLDivElement | null>(null);
const errorFlag = ref(false),
  errorDetails = ref("");

onMounted(() => {
  if (plotRef.value) {
    try {
      let a = functionPlot({
        width: props.graphWidth,
        height: props.graphHeight,
        ...(<object>yaml.load(decodeURIComponent(props.code!))),
        target: plotRef.value,
      });
      a.syncOptions;
    } catch (e) {
      errorFlag.value = true;
      errorDetails.value = e.toString().replace("\n", "<br/>");
    }
  }
});
</script>

<style>
.graph-container {
  color: black;
  user-select: none;
}
.graph-dark.graph-container .canvas {
  filter: invert(100%) hue-rotate(180deg) brightness(125%) contrast(80%);
}
.graph-dark.graph-container .graph,
.graph-dark.graph-container .tip{
  filter: invert(100%) hue-rotate(180deg) brightness(80%) contrast(125%);
}
.graph-container svg.function-plot {
  margin: 0 auto;
}
</style>
