<template>
  <div ref="host" class="file-widget">
    <Suspense v-if="visible">
      <component :is="renderer" :src="src" :mode="mode" />
      <template #fallback>
        <div class="file-widget-placeholder">组件加载中</div>
      </template>
    </Suspense>
    <div v-else class="file-widget-placeholder">组件将在滚动到附近时加载</div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'

type FileWidgetKind = 'geogebra' | 'geojson'

const props = defineProps<{
  kind: FileWidgetKind
  src: string
  mode?: string
}>()

const renderers = {
  geogebra: defineAsyncComponent(() => import('../geogebra/geogebra.vue')),
  geojson: defineAsyncComponent(() => import('../geojson/geojson-map.vue')),
}

const renderer = computed(() => renderers[props.kind])
const host = ref<HTMLElement>()
const visible = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!host.value || typeof IntersectionObserver === 'undefined') {
    visible.value = true
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      visible.value = true
      observer?.disconnect()
      observer = undefined
    },
    { rootMargin: '400px 0px' },
  )
  observer.observe(host.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped lang="scss">
.file-widget-placeholder {
  display: grid;
  min-height: 450px;
  margin: 16px 0;
  place-items: center;
  color: var(--vp-c-text-2);
  font-size: 18px;
  border-radius: 8px;
  background-color: light-dark(white, #191919);
  box-shadow: 0 0 0 1px var(--vp-c-border);
}
</style>
