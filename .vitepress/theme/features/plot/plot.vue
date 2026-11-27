<template>
  <div
    class="graph"
    :class="{ 'no-interact': !interactActivated }"
    ref="shellRef"
    @click.once="interactActivated = true"
  >
    <PlotRender :id="props.id" :code="props.code" :graphWidth="width" :graphHeight="height" />
    <a :href="externalLink" target="_blank" rel="noopener noreferrer" class="graph-external">
      <span class="icon vpi-square-pen edit-link-icon"></span>
      在外部打开
    </a>
  </div>
</template>
<script setup lang="ts">
import site from '#shared/site.json'
import PlotRender from './plot-render.vue'
import base64 from 'base-64'
import JSON5 from 'json5'
import utf8 from 'utf8'
import { computed, onMounted, ref } from 'vue'

const MAX_HEIGHT = 350,
  RATIO = 0.75

const shellRef = ref<HTMLDivElement | null>(null)

const props = defineProps<{
  id: string
  code: string
}>()
const width = ref(0),
  height = ref(0)
const interactActivated = ref(false)

const handleResize = () => {
  if (shellRef.value && width.value !== shellRef.value.clientWidth) {
    width.value = shellRef.value.clientWidth
    height.value = width.value * RATIO > MAX_HEIGHT ? MAX_HEIGHT : width.value * RATIO
  }
}
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

const externalLink = computed(() => {
  const miniCode = JSON5.stringify(JSON5.parse(decodeURIComponent(props.code)))
  const query = base64.encode(utf8.encode(miniCode)).replace(/=+$/g, '')
  return site.externalGraphBase + query
})
</script>

<style lang="scss" scoped>
.graph {
  width: 100%;
  position: relative;
  &.no-interact :deep(.zoom-and-drag) {
    display: none;
  }
}
.graph-external {
  display: flex;
  align-items: center;
  gap: 0.3em;
  font-size: 14px;
  padding: 0.3em 0.6em;
  position: absolute;
  bottom: 25px;
  right: 20px;
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
