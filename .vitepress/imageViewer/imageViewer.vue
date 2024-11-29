<template>
  <transition name="fade">
    <div v-if="props.display" class="viewer-wrapper">
      <div class="viewer-overlay" @click="emits('close')"></div>
      <img
        :src="props.src"
        :alt="props.alt"
        :style="`top:${windowHeight / 2}px;left:${windowWidth / 2}px;width:${(props.initWidth ?? 100) * scale}px;height:${(props.initHeight ?? 100) * scale}px;`"
        class="viewer-img"
        draggable="false"
        @wheel="handleScroll"
      />
      <div class="viewer-toolbar"></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watchEffect, ref, onMounted, onUnmounted } from "vue";
const emits = defineEmits(["close"]);
const props = defineProps({
  src: String,
  alt: String,
  initWidth: Number,
  initHeight: Number,
  display: Boolean,
});

watchEffect(
  () => (document.body.style.overflow = props.display ? "hidden" : "")
);

const windowWidth = ref(0),
  windowHeight = ref(0);
const getWindowResize = () =>
  ({ innerWidth: windowWidth.value, innerHeight: windowHeight.value } = window);
onMounted(() => {
  getWindowResize();
  window.addEventListener("resize", getWindowResize);
});
onUnmounted(() => window.removeEventListener("resize", getWindowResize));

const scale = ref(1);
const limitRange = (input: number, [min, max]: [number, number]) =>
  input > max ? max : input < min ? min : input;
const handleScroll = ({ deltaY }: WheelEvent) =>
  (scale.value = limitRange(scale.value + deltaY / 100, [0.5, 5]));
</script>
<style>
.viewer-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 175;
}
.viewer-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #202127;
  opacity: 0.4;
}
.viewer-img {
  position: absolute;
  transform: translate(-50%, -50%);
  max-width: unset;
}
.viewer-toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  width: 100px;
  background: #f003;
  margin: 0 auto;
}
.viewer-img {
  --gray: #eee;
  --size: 15px;
  background-color: white;
  background-image: linear-gradient(
      45deg,
      var(--gray) 25%,
      transparent 0,
      transparent 75%,
      var(--gray) 0
    ),
    linear-gradient(
      45deg,
      var(--gray) 25%,
      transparent 0,
      transparent 75%,
      var(--gray) 0
    );
  background-position:
    0 0,
    var(--size) var(--size);
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
  background-attachment: fixed;
  cursor: grab;
}
.viewer-img:active {
  cursor: grabbing;
}
.viewer-backdrop {
  background: #20212780 !important;
}
</style>

<style scoped>
.viewer-wrapper {
  transition: opacity 0.2s;
}
.fade-enter-active,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
</style>
