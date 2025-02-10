<template>
  <transition name="viewer-fade">
    <div
      v-if="props.display"
      class="viewer-wrapper"
      @wheel="handleScroll"
      @touchstart="handleTouch"
    >
      <div class="viewer-overlay" @click="close()"></div>
      <div
        class="viewer-img"
        :class="{
          filter: filterEnabled,
          filteroff: !filterEnabled,
          transition: transitionEnabled,
        }"
        :style="style"
        @mousedown="handleDrag"
      >
        <img
          v-if="props.src"
          class="viewer-img-inner image"
          :src="props.src"
          :alt="props.alt"
          draggable="false"
        />
        <div
          v-if="props.svg"
          class="viewer-img-inner svg"
          v-html="props.svg"
        ></div>
      </div>
      <div class="viewer-toolbar" @touchstart.stop="null">
        {{ Math.round(scale * 100) }}%
        <button
          v-if="isDark"
          class="viewer-filter"
          :class="{ enabled: filterEnabled && isDark }"
          @click="filterEnabled = !filterEnabled"
        >
          <svg height="22" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m19 19l-7-8v8H5l7-8V5h7m0-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"
            />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
/// <reference path="../types.d.ts" />
import type { StyleValue } from "vue";
import { watchEffect, ref, computed, reactive, onUnmounted } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();
const emits = defineEmits(["close"]);
const close = () => emits("close");
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
const limitRange = (
  input: number,
  [min, max]: [number, number] = [0.1, 2.5]
) => (input > max ? max : input < min ? min : input);

/** CSS 属性 */
const style = computed(
  (): StyleValue => ({
    width: props.initWidth! + "px",
    height: props.initHeight! + "px",
    transform: `translate(${position.x - props.initWidth! / 2}px,${position.y - props.initHeight! / 2}px) scale(${scale.value})`,
  })
);
const transitionEnabled = ref(false);
const filterEnabled = ref(false);

// 维护窗口大小信息
const getWindowResize = () =>
  ([frame.width, frame.height] = [window.innerWidth, window.innerHeight]);
interface Limit {
  value: number;
  limit: number;
}
const limitRatio = (...limitValues: Limit[]) =>
  Math.min(1, ...limitValues.map(({ value, limit }) => limit / value));

/** 是否打开过 */
let openedFlag = false;

/** 监听开启关闭 */
watchEffect(() => {
  if (import.meta.env.SSR) return;
  if (props.display) {
    getWindowResize();
    [position.x, position.y] = [frame.width / 2, frame.height / 2];
    scale.value = limitRatio(
      { value: props.initHeight!, limit: frame.height },
      { value: props.initWidth!, limit: frame.width }
    );
    window.addEventListener("resize", getWindowResize);
    filterEnabled.value = Boolean(
      isDark.value && (props.svg || !props.alt?.includes("&keep-color"))
    );
    openedFlag = true;
  } else if (openedFlag) {
    window.removeEventListener("resize", getWindowResize);
  }
});
onUnmounted(() => window.removeEventListener("resize", getWindowResize));

const convertRatio = (delta: number) =>
  delta > 0 ? 1 + delta : 1 / (1 - delta);
/** 滚轮缩放 */
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

let onTouching = false;
let lastTap = 0,
  closeTimer: NodeJS.Timeout;
/** 触屏 */
const handleTouch = (event: TouchEvent) => {
  if (onTouching) return;
  onTouching = true;
  transitionEnabled.value = false;
  type TouchData =
    | {
        type: "drag";
        x: number;
        y: number;
      }
    | {
        type: "zoom";
        x: number;
        y: number;
        distance: number;
      };
  let begin: TouchData;
  let lastScale = scale.value;
  const timeStamp = Number(new Date());
  const originalPosition = { x: position.x, y: position.y };
  const getDistance = (dx: number, dy: number) => (dx ** 2 + dy ** 2) ** 0.5;
  const init = (type: "drag" | "zoom", event: TouchEvent): TouchData =>
    type === "drag"
      ? {
          type,
          x: event.touches[0].clientX - position.x,
          y: event.touches[0].clientY - position.y,
        }
      : {
          type,
          x:
            (event.touches[0].clientX + event.touches[1].clientX) / 2 -
            position.x,
          y:
            (event.touches[0].clientY + event.touches[1].clientY) / 2 -
            position.y,
          distance: getDistance(
            event.touches[1].clientX - event.touches[0].clientX,
            event.touches[1].clientY - event.touches[0].clientY
          ),
        };
  if (event.touches.length === 1) {
    begin = init("drag", event);
  } else if (event.touches.length === 2) {
    begin = init("zoom", event);
    lastScale = scale.value;
  }
  const onTouchMove = (event: TouchEvent) => {
    if (!begin) return;
    transitionEnabled.value = false;
    if (event.touches.length === 1) {
      if (begin.type !== "drag") return (begin = init("drag", event));
      position.x = event.touches[0].clientX - begin.x;
      position.y = event.touches[0].clientY - begin.y;
    } else if (event.touches.length === 2) {
      if (begin.type !== "zoom") return (begin = init("zoom", event));
      const dx = event.touches[1].clientX - event.touches[0].clientX;
      const dy = event.touches[1].clientY - event.touches[0].clientY;
      const newScale = limitRange(
        (lastScale * getDistance(dx, dy)) / begin.distance
      );
      const newPosition = {
        x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
        y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
      };
      position.x = newPosition.x - begin.x * (newScale / lastScale);
      position.y = newPosition.y - begin.y * (newScale / lastScale);
      scale.value = newScale;
    }
  };
  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length !== 0) return;
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
    if (
      begin.type === "drag" &&
      Number(new Date()) - timeStamp < 100 &&
      getDistance(
        originalPosition.x - position.x,
        originalPosition.y - position.y
      ) < 5
    ) {
      // 单击关闭，双击放大/缩小
      if (!lastTap || timeStamp - lastTap > 300) {
        closeTimer = setTimeout(close, 300);
        lastTap = Number(new Date());
      } else {
        transitionEnabled.value = true;
        setTimeout(() => {
          const newScale =
            scale.value * 3 > 10
              ? scale.value / 3
              : limitRange(scale.value * 3);
          position.x += begin.x - (begin.x / scale.value) * newScale;
          position.y += begin.y - (begin.y / scale.value) * newScale;
          scale.value = newScale;
        }, 50);
        clearTimeout(closeTimer);
      }
    }
    setTimeout(() => (onTouching = false), 10);
  };
  document.addEventListener("touchmove", onTouchMove);
  document.addEventListener("touchend", onTouchEnd);
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
  background-color: #000e;
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
  transition: transform 0.1s;
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
  border: #8885 1px solid;
  box-shadow: #0005 0 0 15px;
  transition: transform 0.2s cubic-bezier(0.08, 0.61, 0.45, 1);
}
.viewer-filter {
  vertical-align: text-bottom;
  padding-left: 10px;
  margin-left: 6px;
  border-left: 1px solid #fff6;
  transition: color 0.1s;
}
.viewer-filter.enabled {
  color: var(--vp-c-brand);
}
.viewer-img.filter {
  --white: black;
  --gray: #141417;
}
.viewer-img.filter .viewer-img-inner {
  filter: invert(100%) hue-rotate(180deg) contrast(80%) !important;
}
.viewer-img.filteroff .viewer-img-inner {
  filter: none !important;
}
</style>

<style>
.viewer-wrapper {
  transition: opacity 0.2s;
}
.viewer-fade-enter-from .viewer-toolbar {
  transform: translateY(15px);
}
.viewer-fade-enter-active,
.viewer-fade-leave-to {
  opacity: 0;
}
.viewer-fade-enter-to {
  opacity: 1;
}
body:has(.viewer-wrapper) {
  overflow: hidden;
}
.viewer-img-inner.image {
  border-radius: 0;
}
</style>
