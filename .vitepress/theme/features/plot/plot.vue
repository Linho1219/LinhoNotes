<template>
  <div
    class="graph"
    :class="{ 'no-interact': !interactActivated }"
    ref="shellRef"
    @click.once="interactActivated = true"
  >
    <PlotRender :id :json5 :graphWidth :graphHeight />
    <a :href="props.externalLink" target="_blank" rel="noopener noreferrer" class="graph-external">
      <span class="icon vpi-square-pen edit-link-icon"></span>
      在外部打开
    </a>
  </div>
</template>
<script setup lang="ts">
import PlotRender from './plot-render.vue'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const MAX_HEIGHT = 350,
  RATIO = 0.75

const shellRef = useTemplateRef('shellRef')

const props = defineProps<{
  id: string
  json5: string
  externalLink: string
}>()
const graphWidth = ref(0)
const graphHeight = ref(0)
const interactActivated = ref(false)

const handleResize = () => {
  if (shellRef.value && graphWidth.value !== shellRef.value.clientWidth) {
    graphWidth.value = shellRef.value.clientWidth
    graphHeight.value =
      graphWidth.value * RATIO > MAX_HEIGHT ? MAX_HEIGHT : graphWidth.value * RATIO
  }
}

let resizeObserver: ResizeObserver | null = null
onMounted(() => {
  handleResize()
  resizeObserver = new ResizeObserver(handleResize)
  if (shellRef.value) resizeObserver.observe(shellRef.value)
})
onUnmounted(() => {
  if (resizeObserver && shellRef.value) resizeObserver.unobserve(shellRef.value)
})
</script>

<style lang="scss" scoped>
.graph {
  width: 100%;
  margin: 1rem 0;
  position: relative;
  &.no-interact :deep(.zoom-and-drag) {
    display: none;
  }
}
.graph-external {
  padding: 0.3em 0.6em;
  position: absolute;
  bottom: 25px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 0.3em;
  font-size: 14px;
  color: var(--vp-c-brand) !important;
  text-decoration: none !important;
  border-radius: 3px;
  transition: background-color 0.2s;
  .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
  }
  &::after {
    content: unset !important;
  }
  &:hover {
    background-color: var(--vp-c-brand-soft);
    &:active {
      filter: brightness(0.6);
    }
  }
}
</style>
