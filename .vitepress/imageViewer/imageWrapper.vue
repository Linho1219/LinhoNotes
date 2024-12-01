<template>
  <img
    class="viewer-trigger"
    :src="props.src"
    :alt="props.alt"
    @click="viewerOpened = true"
    ref="imageEle"
  />
  <Teleport to="body">
    <ImageViewer
      :src="props.src"
      :alt="props.alt"
      :initWidth="imageEle?.naturalWidth"
      :initHeight="imageEle?.naturalHeight"
      :display="viewerOpened"
      @close="viewerOpened = false"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ImageViewer from "./imageViewer.vue";
const props = defineProps({
  src: String,
  alt: String,
});
const viewerOpened = ref(false);
const imageEle = ref<HTMLImageElement | null>(null);
</script>

<style>
.viewer-trigger {
  cursor: zoom-in;
}
</style>
