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
import type { FunctionPlotOptions } from 'function-plot'
import functionPlot from 'function-plot'
import JSON5 from 'json5'
import { ref, onMounted, watchEffect } from 'vue'

type FPObject = FunctionPlotOptions & { center?: [number, number]; disableZoom?: boolean }

const props = defineProps<{
  id: string
  code: string
  graphWidth: number
  graphHeight: number
}>()

const plotRef = ref<HTMLDivElement | null>(null)
const errorFlag = ref(false),
  errorDetails = ref(''),
  disableZoom = ref(false)

type Size = [number, number]

const defaultHalfX = 6

const getMid = (domain: Size): number => (domain[0] + domain[1]) / 2
const getHalf = (domain: Size): number => (domain[1] - domain[0]) / 2
function determineDomain(
  width: number,
  height: number,
  originalOpt: FPObject,
): { xDomain: Size; yDomain: Size } {
  if (originalOpt.xAxis?.domain && originalOpt.yAxis?.domain)
    return {
      xDomain: originalOpt.xAxis.domain,
      yDomain: originalOpt.yAxis.domain,
    }
  let centerX = 0
  let centerY = 0
  let halfX = defaultHalfX
  let halfY = (halfX * height) / width
  if (originalOpt.center) [centerX, centerY] = originalOpt.center
  if (originalOpt.xAxis?.domain) {
    centerX = getMid(originalOpt.xAxis.domain)
    halfX = getHalf(originalOpt.xAxis.domain)
    halfY = (halfX * height) / width
  } else if (originalOpt.yAxis?.domain) {
    centerY = getMid(originalOpt.yAxis.domain)
    halfY = getHalf(originalOpt.yAxis.domain)
    halfX = (halfY * width) / height
  }
  return {
    xDomain: [centerX - halfX, centerX + halfX],
    yDomain: [centerY - halfY, centerY + halfY],
  }
}

function makeAxis(width: number, height: number, originalOpt: FPObject) {
  const { xDomain, yDomain } = determineDomain(width, height, originalOpt)
  return {
    xAxis: originalOpt.xAxis ? { ...originalOpt.xAxis, domain: xDomain } : { domain: xDomain },
    yAxis: originalOpt.yAxis ? { ...originalOpt.yAxis, domain: yDomain } : { domain: yDomain },
  }
}

onMounted(() => {
  const generateOpt = (
    originalOpt: FPObject,
    [width, height]: Size,
    target: HTMLElement,
  ): FPObject => ({
    width,
    height,
    ...originalOpt,
    ...makeAxis(width, height, originalOpt),
    target,
  })

  if (plotRef.value) {
    let originalOpt: FPObject | undefined
    try {
      originalOpt = <FPObject | undefined>JSON5.parse(props.code!)
    } catch (eJSON5) {
      errorFlag.value = true
      errorDetails.value = String(eJSON5)
      return
    }
    if (typeof originalOpt !== 'object') {
      errorFlag.value = true
      errorDetails.value = `Illegal plot options: ${originalOpt}`
      return
    }
    if (originalOpt.disableZoom) {
      disableZoom.value = true
    }
    watchEffect(() => {
      if (plotRef.value && props.graphWidth && props.graphHeight) {
        try {
          functionPlot(
            generateOpt(originalOpt, [props.graphWidth, props.graphHeight], plotRef.value),
          )
        } catch (e) {
          errorFlag.value = true
          errorDetails.value = String(e)
        }
      }
    })
  }
})
</script>

<style lang="scss">
.graph-container {
  color: black;
  user-select: none;
  filter: hue-rotate(30deg) brightness(75%);
  .dark & {
    filter: hue-rotate(30deg) invert(100%) hue-rotate(180deg) brightness(133%);
    .annotations {
      filter: contrast(30%);
    }
  }
  .fn-text {
    filter: brightness(60%) saturate(150%);
  }

  &.disable-zoom .zoom-and-drag {
    display: none;
  }
}

.graph-error pre {
  white-space: pre-wrap;
}
</style>
