<template>
  <div class="ggb-component" :class="{ loading }">
    <div class="ggb-shell">
      <div :id="domID"></div>
    </div>
    <div v-if="loading" class="ggb-loading">{{ loadingText }}</div>
  </div>
</template>

<script setup lang="ts">
import './ggb-applet.d.ts'
import { loadGeoGebra } from './load-geogebra'
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'

const props = defineProps<{
  src: string
  mode?: GeoGebraParameters['appName']
}>()
const appID = '_ggb_' + Math.random().toString(36).substring(2, 15)
const domID = 'dom' + appID
const loading = ref(true)
const instance = shallowRef<GeoGebraApplet | null>(null)
const loadingText = ref('')
let disposed = false

const init = () => {
  loadingText.value = 'GeoGebra 加载中'
  const applet = new GGBApplet({
    id: appID,
    appName: props.mode || 'suite',
    height: 450,
    filename: props.src,
    showAlgebraInput: false,
    showLogging: false,
    // showResetIcon: true,
    showFullscreenButton: true,
    borderRadius: 8,
    showZoomButtons: true,
    algebraInputPosition: 'top',
    appletOnLoad() {
      if (!disposed) loading.value = false
    },
  })
  applet.inject(domID)
  instance.value = applet
}

onMounted(async () => {
  loadingText.value = 'GeoGebra 加载中'
  if (!props.src) {
    loadingText.value = 'GeoGebra 源文件丢失'
    return
  }

  try {
    await loadGeoGebra()
    if (!disposed) init()
  } catch (error) {
    console.error('GeoGebra 加载失败', error)
    loadingText.value = 'GeoGebra 加载失败'
  }
})

onUnmounted(() => {
  disposed = true
  instance.value?.remove?.()
  instance.value = null
})
</script>

<style lang="scss">
.ggb-component {
  margin: 16px 0;
  position: relative;
  border-radius: 8px;
  background-color: light-dark(white, #191919);
  box-shadow: 0 0 0 1px var(--vp-c-border);
  &.loading {
    min-height: 450px;
  }
}
.ggb-loading {
  position: absolute;
  inset: 0;
  margin: auto;
  height: fit-content;
  width: fit-content;
  color: var(--vp-c-text-2);
  font-size: 18px;
}
.ggb-shell {
  color: black;
  position: relative;
}
.dark .ggb-shell .appletParameters {
  filter: hue-rotate(180deg) brightness(90%) invert(100%);
}
.ggb-shell img {
  filter: none !important;
}
.GeoGebraFrame,
.ggb_preview {
  background: transparent !important;
  border-color: transparent !important;
  outline: none !important;
}
.circle-loading {
  color: var(--vp-c-brand);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
</style>
