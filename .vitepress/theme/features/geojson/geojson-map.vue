<template>
  <div class="geojson-map-component" role="region" aria-label="GeoJSON 地图">
    <div ref="container" class="geojson-map"></div>
    <div v-if="status" class="geojson-map-status" :class="{ error: failed }">
      {{ status }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  GeoJSONSource,
  Map,
  NavigationControl,
  setWorkerUrl,
  type ErrorEvent as MapLibreErrorEvent,
} from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useData } from 'vitepress'
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'

const SOURCE_ID = 'file-widget-geojson'
const MAP_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
} as const
const LOAD_TIMEOUT = 30_000

setWorkerUrl(workerUrl)

const props = defineProps<{
  src: string
}>()

const { isDark } = useData()
const container = ref<HTMLElement>()
const instance = shallowRef<Map>()
const status = ref('地图加载中')
const failed = ref(false)
let disposed = false
let hasFittedBounds = false
let currentStyle = isDark.value ? MAP_STYLES.dark : MAP_STYLES.light
let resizeObserver: ResizeObserver | undefined
let loadTimer: ReturnType<typeof setTimeout> | undefined

function finishLoading() {
  if (loadTimer) clearTimeout(loadTimer)
  loadTimer = undefined
  failed.value = false
  status.value = ''
}

function showError(message: string, error?: unknown) {
  if (loadTimer) clearTimeout(loadTimer)
  loadTimer = undefined
  failed.value = true
  status.value = message
  if (error) console.error(message, error)
}

async function addGeoJSONLayers(map: Map) {
  map.addSource(SOURCE_ID, {
    type: 'geojson',
    data: props.src,
  })

  map.addLayer({
    id: `${SOURCE_ID}-polygon-fill`,
    type: 'fill',
    source: SOURCE_ID,
    filter: ['==', ['geometry-type'], 'Polygon'],
    paint: {
      'fill-color': '#3b82f6',
      'fill-opacity': 0.24,
    },
  })

  map.addLayer({
    id: `${SOURCE_ID}-polygon-outline`,
    type: 'line',
    source: SOURCE_ID,
    filter: ['==', ['geometry-type'], 'Polygon'],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#2563eb',
      'line-width': 2,
      'line-opacity': 0.9,
    },
  })

  map.addLayer({
    id: `${SOURCE_ID}-lines`,
    type: 'line',
    source: SOURCE_ID,
    filter: ['==', ['geometry-type'], 'LineString'],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#e11d48',
      'line-width': 4,
      'line-opacity': 0.9,
    },
  })

  map.addLayer({
    id: `${SOURCE_ID}-points`,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['==', ['geometry-type'], 'Point'],
    paint: {
      'circle-color': '#e11d48',
      'circle-radius': 6,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    },
  })

  if (hasFittedBounds) return

  const source = map.getSource<GeoJSONSource>(SOURCE_ID)
  const bounds = await source?.getBounds()

  // A theme switch can replace the style while the previous source is still
  // loading. Ignore bounds returned by a source that is no longer current.
  if (disposed || source !== map.getSource(SOURCE_ID)) return
  if (!bounds || bounds.isEmpty()) {
    showError('GeoJSON 中没有可显示的地理要素')
    return
  }

  map.fitBounds(bounds, {
    padding: 36,
    maxZoom: 15,
    duration: 0,
  })
  hasFittedBounds = true
  finishLoading()
}

watch(isDark, (dark) => {
  const style = dark ? MAP_STYLES.dark : MAP_STYLES.light
  if (style === currentStyle) return

  currentStyle = style
  instance.value?.setStyle(style)
})

onMounted(() => {
  if (!container.value) {
    showError('地图容器初始化失败')
    return
  }

  loadTimer = setTimeout(() => showError('地图加载超时'), LOAD_TIMEOUT)

  try {
    const map = new Map({
      container: container.value,
      style: currentStyle,
      center: [0, 0],
      zoom: 1,
      cooperativeGestures: false,
      dragRotate: false,
      touchPitch: false,
    })

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right')
    map.on('error', (event: MapLibreErrorEvent) => {
      console.error('MapLibre 渲染错误', event.error)
    })
    map.on('style.load', async () => {
      if (disposed) return

      try {
        await addGeoJSONLayers(map)
      } catch (error) {
        showError('GeoJSON 加载失败', error)
      }
    })

    resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(container.value)
    instance.value = map
  } catch (error) {
    showError('地图初始化失败', error)
  }
})

onUnmounted(() => {
  disposed = true
  if (loadTimer) clearTimeout(loadTimer)
  resizeObserver?.disconnect()
  instance.value?.remove()
  instance.value = undefined
})
</script>

<style scoped lang="scss">
.geojson-map-component {
  position: relative;
  min-height: 450px;
  margin: 16px 0;
  overflow: hidden;
  border-radius: 8px;
  background-color: light-dark(white, #191919);
  box-shadow: 0 0 0 1px var(--vp-c-border);
}

.geojson-map {
  width: 100%;
  height: 450px;

  :deep(summary) {
    margin: 0;
    &::before {
      content: unset;
    }
  }

  :deep(.maplibregl-ctrl-attrib-button:focus, .maplibregl-ctrl-group button:focus) {
    box-shadow: none;
  }
}

.dark .geojson-map {
  :deep(.maplibregl-ctrl-top-right) {
    filter: invert(1);
  }

  :deep(.maplibregl-ctrl-attrib-button) {
    filter:invert(1)
  }
  :deep(.maplibregl-compact) {
    background-color: var(--vp-c-bg);
    color: var(--vp-c-text-2);
    a {
      color: inherit;
    }
  }
}

.geojson-map-status {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--vp-c-text-2);
  font-size: 18px;
  background-color: light-dark(white, #191919);
  pointer-events: none;

  &.error {
    color: var(--vp-c-danger-1);
  }
}
</style>
