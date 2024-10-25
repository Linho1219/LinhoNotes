<template>
  <div
    v-if="!errorFlag"
    class="graph-container"
    ref="plotRef"
    :class="isDark ? 'graph-dark' : 'graph-light'"
  ></div>
  <div v-if="errorFlag" class="graph-error caution custom-block github-alert">
    <p class="custom-block-title">函数渲染错误</p>
    <pre v-html="errorDetails"></pre>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
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
      const options = {
        width: props.graphWidth,
        height: props.graphHeight,
        ...(<object>yaml.load(decodeURIComponent(props.code!))),
        target: plotRef.value,
      };
      functionPlot(options);
      watchEffect(() => {
        options.width = props.graphWidth;
        options.height = props.graphHeight;
        functionPlot(options);
      });
    } catch (e) {
      errorFlag.value = true;
      errorDetails.value = e.toString();
    }
  }
});
</script>

<style>
.graph-container {
  color: black;
  user-select: none;
}

.graph-container {
  filter: brightness(90%) hue-rotate(25deg);
}

.graph-dark.graph-container {
  filter: invert(100%) hue-rotate(210deg) brightness(150%);
}
.graph-dark.graph-container .graph,
.graph-dark.graph-container .tip,
.graph-dark.graph-container .top-right-legend {
  filter: invert(100%) hue-rotate(180deg);
}
.graph-container .annotations,.graph-container .fn-text{
  filter: brightness(70%);
}
.graph-dark.graph-container .annotations{
  filter: invert(100%) brightness(0);
}
.graph-container svg.function-plot {
  margin: 0 auto;
}
.graph-error pre {
  white-space: pre-wrap;
}
</style>
