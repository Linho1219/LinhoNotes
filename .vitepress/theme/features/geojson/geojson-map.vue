<template>
  <div class="geojson-map-component" role="region" aria-label="GeoJSON 地图">
    <div ref="container" class="geojson-map"></div>
    <div v-if="status" class="geojson-map-status" :class="{ error: failed }">
      {{ status }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { PaletteJSON } from '../utils/palette'
import MapStyleDark from './map-style-dark.json?url'
import MapStyleLight from './map-style-light.json?url'
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
const MAP_STYLES = { light: MapStyleLight, dark: MapStyleDark }
const COLOR_PROPERTY = 'color'
const LABEL_PROPERTY = 'label'
const DEFAULT_COLOR_LIGHT = 'indigo'
const DEFAULT_COLOR_DARK = 'yellow'
const HALO_COLOR_LIGHT = '#ffffff'
const HALO_COLOR_DARK = '#111111'
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

function createPaletteColorExpression(colors: Record<string, string>, fallback: string) {
  const expression: unknown[] = ['match', ['get', COLOR_PROPERTY]]

  for (const [name, color] of Object.entries(colors)) expression.push(name, color)
  expression.push(fallback)

  return expression as any
}

function usesNameProperty(value: unknown): boolean {
  if (typeof value === 'string') {
    return (
      value === 'name' ||
      value === 'name_en' ||
      value.startsWith('name:') ||
      value.includes('{name')
    )
  }
  if (Array.isArray(value)) return value.some(usesNameProperty)
  if (value && typeof value === 'object') return Object.values(value).some(usesNameProperty)
  return false
}

function createChinesePreferredName() {
  return [
    'case',
    ['has', 'name:zh-Hans'],
    ['get', 'name:zh-Hans'],
    ['has', 'name:zh'],
    ['get', 'name:zh'],
    ['has', 'name:zh-Hant'],
    ['get', 'name:zh-Hant'],
    ['get', 'name'],
  ]
}

function localizeBaseMap(map: Map) {
  for (const layer of map.getStyle().layers) {
    if (layer.type !== 'symbol') continue

    const textField = layer.layout?.['text-field']
    if (!textField || !usesNameProperty(textField)) continue

    map.setLayoutProperty(layer.id, 'text-field', createChinesePreferredName() as any)
  }
}

async function addGeoJSONLayers(map: Map) {
  const palette = isDark.value ? PaletteJSON.dark : PaletteJSON.light
  const defaultColor = isDark.value ? DEFAULT_COLOR_DARK : DEFAULT_COLOR_LIGHT
  const textColor = createPaletteColorExpression(palette.text, palette.text[defaultColor])
  const softColor = createPaletteColorExpression(palette.soft, palette.soft[defaultColor])
  const haloColor = isDark.value ? HALO_COLOR_DARK : HALO_COLOR_LIGHT

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
      'fill-color': softColor,
      'fill-opacity': 1,
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
      'line-color': textColor,
      'line-width': 1.5,
      'line-opacity': 0.9,
    },
  })

  map.addLayer({
    id: `${SOURCE_ID}-lines-halo`,
    type: 'line',
    source: SOURCE_ID,
    filter: ['==', ['geometry-type'], 'LineString'],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': haloColor,
      'line-width': 9,
      'line-blur': 2,
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
      'line-color': textColor,
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
      'circle-color': textColor,
      'circle-radius': 5,
      'circle-stroke-color': haloColor,
      'circle-stroke-width': 2,
    },
  })

  map.addLayer({
    id: `${SOURCE_ID}-point-labels`,
    type: 'symbol',
    source: SOURCE_ID,
    filter: ['all', ['==', ['geometry-type'], 'Point'], ['has', LABEL_PROPERTY]],
    layout: {
      'text-field': ['to-string', ['get', LABEL_PROPERTY]],
      'text-font': ['Noto Sans Regular'],
      'text-size': 13,
      'text-variable-anchor': [
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      'text-radial-offset': 0.9,
      'text-justify': 'auto',
      'text-padding': 2,
      'text-max-width': 12,
    },
    paint: {
      'text-color': textColor,
      'text-halo-color': haloColor,
      'text-halo-width': 1.5,
      'text-halo-blur': 0.5,
    },
  })

  map.addLayer({
    id: `${SOURCE_ID}-point-collisions`,
    type: 'symbol',
    source: SOURCE_ID,
    filter: ['all', ['==', ['geometry-type'], 'Point']],
    layout: {
      'text-field': '·',
      'text-font': ['Noto Sans Regular'],
      'text-size': 8,
      'text-variable-anchor': ['center'],
      'text-radial-offset': 0,
    },
    paint: {
      'text-opacity': 0,
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
    padding: 70,
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
        localizeBaseMap(map)
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

  :deep(.maplibregl-ctrl) {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  :deep(.maplibregl-compact) {
    background-color: color-mix(in srgb, var(--vp-c-bg) 50%, transparent);
    backdrop-filter: blur(5px);
    user-select: none;
    color: var(--vp-c-text-2);
    a {
      color: inherit;
    }
  }
}

.dark .geojson-map {
  :deep(.maplibregl-ctrl-top-right) {
    filter: invert(1);
  }

  :deep(.maplibregl-ctrl-attrib-button) {
    filter: invert(1);
  }

  :deep(.maplibregl-ctrl-bottom-right .maplibregl-ctrl) {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
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
