<template>
  <div class="mermaid">
    <div
      v-if="!errorFlag"
      class="mermaid_container"
      data-image-viewer="svg"
      :data-image-viewer-width="initWidth"
      :data-image-viewer-height="initHeight"
      v-html="svgRef"
    ></div>
    <div v-if="errorFlag" class="mermaid-error caution custom-block github-alert">
      <p class="custom-block-title">Mermaid 渲染错误</p>
      <pre v-html="errorDetails"></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  code: string
}>()
import mermaid from 'mermaid'
import { useData } from 'vitepress'
import { computed, ref, watch } from 'vue'

const { isDark } = useData()
const theme = computed(() => (isDark.value ? 'dark' : 'light'))

const svgRef = ref(''),
  errorFlag = ref(false),
  errorDetails = ref('')
const initWidth = ref(0),
  initHeight = ref(0)

interface RenderResult {
  svg: string
  width: number
  height: number
}

const renderCache = {
  light: null as RenderResult | null,
  dark: null as RenderResult | null,
}

async function renderMermaid() {
  const output = await mermaid.render(props.id, props.code, {
    config: { theme: isDark.value ? 'redux-dark' : 'redux' },
  })
  const result: RenderResult = {
    svg: output.svg,
    width: output.width,
    height: output.height,
  }
  return result
}

function applyRenderResult(result: RenderResult) {
  svgRef.value = result.svg
  initWidth.value = result.width
  initHeight.value = result.height
}

async function updateMermaid() {
  if (errorFlag.value) return
  if (renderCache[theme.value]) return applyRenderResult(renderCache[theme.value]!)
  try {
    const result = await renderMermaid()
    renderCache[theme.value] = result
    applyRenderResult(result)
  } catch (error) {
    errorFlag.value = true
    errorDetails.value = error instanceof Error ? error.message : String(error)
    console.error(error)
  }
}

watch(() => isDark.value, updateMermaid, { immediate: true })
</script>

<style lang="scss" scoped>
.mermaid {
  --mermaid-fontFamily: var(--vp-font-family-base);
}

.mermaid_container {
  &,
  & p {
    line-height: 1.5em !important;
    user-select: none;
  }
  svg {
    margin: 0 auto;
  }
}
.mermaid-error pre {
  white-space: pre-wrap;
}
</style>
