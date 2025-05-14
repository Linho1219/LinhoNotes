<template>
  <div class="ggb-shell">
    <div :id="domID"></div>
  </div>
</template>

<script setup lang="ts">
/// <reference path="./ggbApplet.d.ts" />

import { onMounted } from "vue";

const props = defineProps<{
  data?: string;
  mode?: GeoGebraParameters["appName"];
}>();
const appID = "_ggb_" + Math.random().toString(36).substring(2, 15);
const domID = "dom" + appID;

const init = () => {
  if (typeof GGBApplet === "undefined") return;
  const applet = new GGBApplet({
    id: appID,
    appName: props.mode,
    height: 450,
    // showMenuBar: false,
    // showToolBar: false,
    ggbBase64: props.data,
    showAlgebraInput: false,
    showLogging: false,
    // showResetIcon: true,
    showFullscreenButton: true,
    borderRadius: 8,
    showZoomButtons: true,
    algebraInputPosition: "top",
  });
  applet.inject(domID);
  // console.log(applet);
  // console.log(appID);
};

onMounted(() => {
  if (typeof GGBApplet !== "undefined") init();
  else if (window) window.onload = init;
});
</script>

<style>
.ggb-shell {
  color: black;
}
.dark .ggb-shell {
  filter: hue-rotate(180deg) brightness(90%) invert(100%);
}
.ggb-shell img {
  filter: none !important;
}
.GeoGebraFrame {
  border-color: transparent !important;
}
</style>
