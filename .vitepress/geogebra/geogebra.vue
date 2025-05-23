<template>
  <div class="ggb-component">
    <div class="ggb-shell">
      <div :id="domID"></div>
    </div>
    <CircleLoading v-if="loading"/>
  </div>
</template>

<script setup lang="ts">
/// <reference path="./ggbApplet.d.ts" />

import { onMounted, ref } from "vue";
import CircleLoading from "./loading.vue";

const props = defineProps<{
  data?: string;
  mode?: GeoGebraParameters["appName"];
}>();
const appID = "_ggb_" + Math.random().toString(36).substring(2, 15);
const domID = "dom" + appID;
const loading = ref(true);

const init = () => {
  if (typeof GGBApplet === "undefined") return setTimeout(init, 500);
  const applet = new GGBApplet({
    id: appID,
    appName: props.mode || "graphing",
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
};

onMounted(() => {
  if (typeof GGBApplet !== "undefined") init();
  else if (window) window.onload = init;
});
</script>

<style>
.ggb-component {
  position: relative;
  min-height: 450px;
}
.ggb-shell {
  color: black;
  margin: 16px 0;
}
.dark .ggb-shell {
  filter: hue-rotate(180deg) brightness(90%) invert(100%);
}
.ggb-shell img {
  filter: none !important;
}
.GeoGebraFrame {
  background: white !important;
  border-color: #d3d3d3 !important;
  outline: none !important;
}
.ggb_preview {
  border-radius: 8px;
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
