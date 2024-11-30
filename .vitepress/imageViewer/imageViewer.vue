<template>
  <transition name="fade">
    <div v-if="props.display" class="viewer-wrapper" @wheel="handleScroll">
      <div class="viewer-overlay" @click="emits('close')"></div>
      <img
        :src="props.src"
        :alt="props.alt"
        :style="`top:${positionTop}px;left:${positionLeft}px;width:${currentWidth}px;height:${currentHeight}px;`"
        class="viewer-img"
        :class="isDragging ? 'dragging' : ''"
        draggable="false"
        @mousedown="handleDrag"
      />
      <div class="viewer-toolbar">{{ Math.round(scale * 100) }}%</div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watchEffect, ref, computed, onUnmounted } from "vue";
const emits = defineEmits(["close"]);
const props = defineProps({
  src: String,
  alt: String,
  initWidth: Number,
  initHeight: Number,
  display: Boolean,
});

const windowWidth = ref(0),
  windowHeight = ref(0);
const positionX = ref(0),
  positionY = ref(0);
const currentWidth = computed(() => props.initWidth! * scale.value),
  currentHeight = computed(() => props.initHeight! * scale.value);
const positionTop = computed(() => positionY.value - currentHeight.value / 2);
const positionLeft = computed(() => positionX.value - currentWidth.value / 2);
const isDragging = ref(false);

// 维护窗口大小信息
const getWindowResize = () =>
  ({ innerWidth: windowWidth.value, innerHeight: windowHeight.value } = window);
watchEffect(() => {
  if (props.display) {
    getWindowResize();
    positionX.value = windowWidth.value / 2;
    positionY.value = windowHeight.value / 2;
    scale.value = 1;
    window.addEventListener("resize", getWindowResize);
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    window.removeEventListener("resize", getWindowResize);
  }
});
onUnmounted(() => window.removeEventListener("resize", getWindowResize));

const scale = ref(1);
const convertRatio = (delta: number) =>
  delta > 0 ? 1 + delta : 1 / (1 - delta);
const limitRange = (input: number, [min, max]: [number, number]) =>
  input > max ? max : input < min ? min : input;
const handleScroll = (event: WheelEvent) => {
  console.log(event);
  const newscale = limitRange(
    scale.value * convertRatio(-event.deltaY / 500),
    [0.5, 50]
  );
  isDragging.value = Math.abs(event.deltaY) < 50;
  positionX.value =
    event.x - ((event.x - positionX.value) / scale.value) * newscale;
  positionY.value =
    event.y - ((event.y - positionY.value) / scale.value) * newscale;
  scale.value = newscale;
};

const handleDrag = (event: MouseEvent) => {
  console.log(event);
  const beginX = event.x - positionX.value,
    beginY = event.y - positionY.value;
  const onMouseMove = (event: MouseEvent) => {
    positionX.value = event.clientX - beginX;
    positionY.value = event.clientY - beginY;
  };
  const onMouseUp = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
  isDragging.value = true;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};
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
  transition: all 0.1s;
}
.viewer-img.dragging {
  transition: none !important;
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
