<template>
  <div v-if="!errorFlag" class="graph-container" ref="plotRef"></div>
  <div v-if="errorFlag" class="graph-error caution custom-block github-alert">
    <p class="custom-block-title">函数渲染错误</p>
    <pre v-html="errorDetails"></pre>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import functionPlot from "./function-plot/src/index";
import yaml from "js-yaml";
import type { FunctionPlotOptions } from "./function-plot/src/types";

const props = defineProps({
  id: String,
  code: String,
  graphWidth: Number,
  graphHeight: Number,
});

const plotRef = ref<HTMLDivElement | null>(null);
const errorFlag = ref(false),
  errorDetails = ref("");

type Size = [number, number];

const X_DOMAIN: Size = [-6, 6];

function computeScale(width: number, height: number, xScale: Size): Size {
  const xDiff = xScale[1] - xScale[0];
  const yDiff = (height * xDiff) / width;
  return [-yDiff / 2, yDiff / 2];
}

onMounted(() => {
  const generateOpt = (
    originalOpt: FunctionPlotOptions,
    [width, height]: Size,
    target: HTMLElement
  ): FunctionPlotOptions => ({
    width,
    height,
    x: {
      domain: originalOpt.y?.domain
        ? computeScale(height, width, originalOpt.y.domain)
        : X_DOMAIN,
    },
    y: {
      domain: computeScale(width, height, originalOpt.x?.domain ?? X_DOMAIN),
    },
    ...originalOpt,
    target,
  });

  if (plotRef.value) {
    try {
      const originalOpt = <FunctionPlotOptions | undefined>(
        yaml.load(decodeURIComponent(props.code!))
      );
      if (typeof originalOpt !== "object")
        throw `Illegal plot options: ${originalOpt}`;
      watchEffect(() => {
        if (plotRef.value && props.graphWidth && props.graphHeight) {
          try {
            functionPlot(
              generateOpt(
                originalOpt,
                [props.graphWidth, props.graphHeight],
                plotRef.value
              )
            );
          } catch (e) {
            errorFlag.value = true;
            errorDetails.value = e.toString();
          }
        }
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

.dark .graph-container {
  filter: invert(100%) hue-rotate(210deg) brightness(150%);
}
.dark .graph-container .graph,
.dark .graph-container .tip,
.dark .graph-container .top-right-legend {
  filter: invert(100%) hue-rotate(180deg);
}
.graph-container .annotations,
.graph-container .fn-text {
  filter: brightness(70%);
}
.dark .graph-container .annotations {
  filter: invert(100%) brightness(0);
}
.graph-container svg.function-plot {
  margin: 0 auto;
}
.graph-error pre {
  white-space: pre-wrap;
}
</style>
