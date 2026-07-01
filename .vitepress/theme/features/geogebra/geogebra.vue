<template>
  <div class="ggb-component" :class="{ loading }">
    <div class="ggb-shell">
      <div :id="domID"></div>
    </div>
    <div v-if="loading" class="ggb-loading">{{ loadingText }}</div>
  </div>
</template>

<script setup lang="ts">
import "./ggb-applet.d.ts";
import { onMounted, onUnmounted, ref, shallowRef } from "vue";

const props = defineProps<{
  data?: string;
  mode?: GeoGebraParameters["appName"];
}>();
const appID = "_ggb_" + Math.random().toString(36).substring(2, 15);
const domID = "dom" + appID;
const loading = ref(true);
const instance = shallowRef<GeoGebraApplet | null>(null);

const dataUrl = ref<string | undefined>(undefined);

const maxAttempts = 10;
let attempts = 0;
const loadingText = ref("");

const init = () => {
  if (typeof GGBApplet === "undefined") {
    if (attempts++ < maxAttempts) setTimeout(init, 500);
    else loadingText.value = "GeoGebra 加载失败";
    return;
  }
  loadingText.value = "GeoGebra 初始化中";
  const applet = new GGBApplet({
    id: appID,
    appName: props.mode || "suite",
    height: 450,
    ggbBase64: props.data,
    showAlgebraInput: false,
    showLogging: false,
    // showResetIcon: true,
    showFullscreenButton: true,
    borderRadius: 8,
    showZoomButtons: true,
    algebraInputPosition: "top",
    appletOnLoad() {
      loading.value = false;
    },
  });
  applet.inject(domID);
  instance.value = applet;
};

onMounted(() => {
  loadingText.value = "GeoGebra 加载中";
  if (!props.data) {
    loadingText.value = "GeoGebra 源文件丢失";
    return;
  }

  init();
});

onUnmounted(() => {
  if (dataUrl.value) URL.revokeObjectURL(dataUrl.value);
});
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
