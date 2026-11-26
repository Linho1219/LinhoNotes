<template>
  <div class="markmap-component">
    <div
      v-if="!errorFlag"
      class="markmap-container"
      data-image-viewer="svg"
      :data-image-viewer-width="initWidth"
      :data-image-viewer-height="initHeight"
      v-html="svgRef"
    ></div>
    <div v-if="errorFlag" class="markmap-error caution custom-block github-alert">
      <p class="custom-block-title">markmap 渲染错误</p>
      <pre>{{ errorDetails }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, ref, watch } from 'vue'
import { parse } from '@markmap/parse'
import {
  createCanvasMeasurer,
  defaultContentPlugins,
  minimalTheme,
  renderTreeAsync,
  resolveRenderOptions,
  toSVGString,
} from '@markmap/render'

const props = defineProps<{
  id: string
  code: string
}>()

const { isDark } = useData()
const colorScheme = computed(() => (isDark.value ? 'dark' : 'light'))

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

const getCssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).replaceAll(/\n\s*/g, '')

async function renderMarkmap(): Promise<RenderResult> {
  const vpFontFamilyBase = getCssVar('--vp-font-family-base')
  const vpFontFamilyMono = getCssVar('--vp-font-family-mono')

  const { root, frontmatter } = parse(props.code)
  const { options, warnings } = resolveRenderOptions({ theme: minimalTheme }, frontmatter.markmap)
  if (warnings.length) throw new Error(`Invalid markmap frontmatter: ${warnings.join('; ')}`)
  const markmapTheme = options.theme ?? minimalTheme
  const output = await renderTreeAsync(root, {
    ...options,
    theme: {
      ...markmapTheme,
      font: { ...markmapTheme.font, family: vpFontFamilyBase },
      codeFontFamily: vpFontFamilyMono,
    },
    measurer: createCanvasMeasurer(),
    plugins: [...defaultContentPlugins],
  })
  const svg = toSVGString(output, {
    background: false,
    colorScheme: colorScheme.value,
    padding: 0,
  }).replace(/(?<=<svg[^>]+)width=".+?" height=".+?"/, 'width="100%"')
  return {
    svg,
    width: output.bounds.width,
    height: output.bounds.height,
  }
}

function applyRenderResult(result: RenderResult) {
  svgRef.value = result.svg
  initWidth.value = result.width
  initHeight.value = result.height
}

async function updateMarkmap() {
  if (errorFlag.value) return
  if (renderCache[colorScheme.value]) return applyRenderResult(renderCache[colorScheme.value]!)
  try {
    const result = await renderMarkmap()
    renderCache[colorScheme.value] = result
    applyRenderResult(result)
  } catch (error) {
    errorFlag.value = true
    errorDetails.value = error instanceof Error ? error.message : String(error)
    console.error(error)
  }
}

watch(() => isDark.value, updateMarkmap, { immediate: true })
</script>

<style lang="scss" scoped>
.markmap-component {
  margin: 1rem 0;
}
.markmap-container {
  user-select: none;
  :deep(.markmap) {
    margin: 0 auto;
  }
}

.markmap-error pre {
  white-space: pre-wrap;
}
</style>

<style>
.markmap.markmap {
  --mm-text: var(--vp-c-text-1);
  --mm-link: var(--vp-c-brand-1);
}
</style>
