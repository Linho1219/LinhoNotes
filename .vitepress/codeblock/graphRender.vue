<template>
  <div
    v-if="!errorFlag"
    class="graph-container"
    ref="plotRef"
    :class="{ 'disable-zoom': disableZoom }"
  ></div>
  <div v-if="errorFlag" class="graph-error caution custom-block github-alert">
    <p class="custom-block-title">函数渲染错误</p>
    <pre v-html="errorDetails"></pre>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import functionPlot from "function-plot";
import JSON5 from "json5";
import type { FunctionPlotOptions } from "function-plot";

const props = defineProps({
  id: String,
  code: String,
  graphWidth: Number,
  graphHeight: Number,
});

const plotRef = ref<HTMLDivElement | null>(null);
const errorFlag = ref(false),
  errorDetails = ref(""),
  disableZoom = ref(false);

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
    xAxis: {
      domain: originalOpt.yAxis?.domain
        ? computeScale(height, width, originalOpt.yAxis.domain)
        : X_DOMAIN,
    },
    yAxis: {
      domain: computeScale(
        width,
        height,
        originalOpt.xAxis?.domain ?? X_DOMAIN
      ),
    },
    ...originalOpt,
    target,
  });

  if (plotRef.value) {
    let originalOpt: FunctionPlotOptions | undefined;
    try {
      originalOpt = <FunctionPlotOptions | undefined>JSON5.parse(decodeURIComponent(props.code!));
    } catch (eJSON5) {
      errorFlag.value = true;
      errorDetails.value = eJSON5;
      return;
    }
    if (typeof originalOpt !== "object") {
      errorFlag.value = true;
      errorDetails.value = `Illegal plot options: ${originalOpt}`;
      return;
    }
    if (originalOpt.disableZoom) {
      disableZoom.value = true;
    }
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
  }
});
</script>

<style>
.graph-container {
  color: black;
  user-select: none;
}
.graph-container {
  filter: hue-rotate(25deg) brightness(75%);
}

.dark .graph-container {
  filter: invert(100%) hue-rotate(210deg) brightness(133%);
}
.dark .graph-container .annotations {
  filter: contrast(30%);
}
.graph-container .fn-text {
  filter: brightness(60%) saturate(150%);
}
.graph-error pre {
  white-space: pre-wrap;
}
.graph-container.disable-zoom .zoom-and-drag {
  display: none;
}
</style>
