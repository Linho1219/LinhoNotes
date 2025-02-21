<template>
  <div
    class="viewer-trigger"
    :class="{ inline: props.inline }"
    @click="viewerOpened = true"
    ref="triggerEle"
  >
    <slot></slot>
  </div>
  <ImageViewer
    :src="slotSrc"
    :alt="slotAlt"
    :initWidth="initWidth"
    :initHeight="initHeight"
    v-model="viewerOpened"
  />
</template>

<script setup lang="ts">
/// <reference path="../types.d.ts" />
import { onMounted, ref } from "vue";
import ImageViewer from "./imageViewer.vue";
const props = defineProps({
  inline: Boolean,
});
const slotSrc = ref("");
const viewerOpened = ref(false);
const triggerEle = ref<HTMLDivElement | null>(null);
const initWidth = ref(0),
  initHeight = ref(0);
const slotAlt = ref("");
onMounted(() => {
  if (!triggerEle.value) return;
  const img = <HTMLImageElement>triggerEle.value.children[0];
  slotSrc.value = img.getAttribute("src") ?? "";
  slotAlt.value = img.alt;
  if (img.complete) {
    initWidth.value = img.naturalWidth;
    initHeight.value = img.naturalHeight;
  } else {
    img.onload = () => {
      initWidth.value = img.naturalWidth;
      initHeight.value = img.naturalHeight;
    };
  }
});
</script>

<style>
.viewer-trigger img {
  margin: 0;
}
.viewer-trigger {
  cursor: zoom-in;
  width: fit-content;
  margin: 0 auto;
}
.viewer-trigger.inline,
td .viewer-trigger {
  display: inline-block;
  vertical-align: middle;
  margin: 0;
}
</style>
