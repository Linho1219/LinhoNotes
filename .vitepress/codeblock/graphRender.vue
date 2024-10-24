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
import functionPlot from "function-plot";
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
        ...(<object>yaml.load(decodeURIComponent(props.code!))),
        target: plotRef.value,
        width: props.graphWidth,
        height: props.graphHeight,
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
}
.graph-dark.graph-container {
  filter: invert(100%) hue-rotate(180deg) brightness(120%) contrast(85%);
}
.graph-container svg {
  max-width: 100%;
}
.graph-container svg.function-plot {
  margin: 0 auto;
}
</style>
