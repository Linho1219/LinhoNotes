<template>
  <transition name="viewer-fade">
    <div
      v-if="props.display"
      class="viewer-wrapper"
      @wheel="handleScroll"
      @touchstart="handleTouch"
    >
      <div class="viewer-overlay" @click="emits('close')"></div>
      <div
        class="viewer-img"
        :class="{ filter: filterEnabled, transition: transitionEnabled }"
        :style="style"
        @mousedown="handleDrag"
      />
      <div class="viewer-toolbar">{{ Math.round(scale * 100) }}%</div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watchEffect, ref, computed, reactive, onUnmounted } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();
const emits = defineEmits(["close"]);
const props = defineProps({
  src: String,
  svg: String,
  alt: String,
  initWidth: Number,
  initHeight: Number,
  display: Boolean,
});

/** 窗口宽高 */
const frame = reactive({
  width: 0,
  height: 0,
});
/** 图片中心点坐标 */
const position = reactive({
  x: 0,
  y: 0,
});
/** 缩放系数 */
const scale = ref(1);
const limitRange = (input: number, [min, max]: [number, number] = [0.5, 50]) =>
  input > max ? max : input < min ? min : input;

/** CSS 属性 */
const style = computed(() => ({
  width: props.initWidth! * scale.value + "px",
  height: props.initHeight! * scale.value + "px",
  top: position.y - (props.initHeight! * scale.value) / 2 + "px",
  left: position.x - (props.initWidth! * scale.value) / 2 + "px",
}));
const transitionEnabled = ref(false);

// 维护窗口大小信息
const getWindowResize = () =>
  ([frame.width, frame.height] = [window.innerWidth, window.innerHeight]);
interface Limit {
  value: number;
  limit: number;
}
const limitRatio = (...limitValues: Limit[]) =>
  Math.min(1, ...limitValues.map(({ value, limit }) => limit / value));
watchEffect(() => {
  if (props.display) {
    getWindowResize();
    [position.x, position.y] = [frame.width / 2, frame.height / 2];
    scale.value = limitRatio(
      { value: props.initHeight!, limit: frame.height },
      { value: props.initWidth!, limit: frame.width }
    );
    window.addEventListener("resize", getWindowResize);
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    window.removeEventListener("resize", getWindowResize);
  }
});
onUnmounted(() => window.removeEventListener("resize", getWindowResize));

/** 滚轮缩放 */
const convertRatio = (delta: number) =>
  delta > 0 ? 1 + delta : 1 / (1 - delta);
const handleScroll = (event: WheelEvent) => {
  const newScale = limitRange(scale.value * convertRatio(-event.deltaY / 500));
  transitionEnabled.value = Math.abs(event.deltaY) > 50;
  position.x = event.x - ((event.x - position.x) / scale.value) * newScale;
  position.y = event.y - ((event.y - position.y) / scale.value) * newScale;
  scale.value = newScale;
};

/** 鼠标拖拽 */
const handleDrag = (event: MouseEvent | PointerEvent) => {
  if ("pointerType" in event && event.pointerType === "touch") return;
  const begin = {
    x: event.x - position.x,
    y: event.y - position.y,
  };
  const onMouseMove = (event: MouseEvent) => {
    position.x = event.clientX - begin.x;
    position.y = event.clientY - begin.y;
  };
  const onMouseUp = () => {
    transitionEnabled.value = true;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
  transitionEnabled.value = false;
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
  user-select: none;
}
.viewer-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #1e1e22;
  opacity: 0.4;
}
.viewer-img {
  position: absolute;
  max-width: unset;
}

.viewer-img {
  --white: white;
  --gray: #f3f3f3;
  --size: 15px;
  background-color: var(--white);
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
.viewer-img.transition {
  transition:
    width 0.1s,
    height 0.1s,
    left 0.1s,
    top 0.1s;
}
.viewer-img:active {
  cursor: grabbing;
}
.viewer-img-inner,
.viewer-img-inner svg {
  width: 100%;
  height: 100%;
  max-width: unset !important;
  max-height: unset !important;
}
.viewer-img-inner.pixel {
  image-rendering: pixelated;
}
.viewer-backdrop {
  background: #1e1e2280;
}

.viewer-toolbar {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  height: 40px;
  margin: 0 auto;
  width: max-content;
  line-height: 40px;
  font-size: 18px;
  padding: 0 10px 0 12px;
  border-radius: 5px;
  background: #2b2b2fa0;
  color: white;
  border:#8885 1px solid;
  box-shadow: #0005 0 0 15px;
  transition: transform 0.2s cubic-bezier(0.08, 0.61, 0.45, 1);
}
}
</style>

<style>
.viewer-wrapper {
  transition: opacity 0.2s;
}
.viewer-fade-enter-from .viewer-toolbar{
  transform: translateY(15px);
}
.viewer-fade-enter-active,
.viewer-fade-leave-to {
  opacity: 0;
}
.viewer-fade-enter-to {
  opacity: 1;
}
</style>
