<template>
  <Teleport to="#imageViewers">
    <transition name="viewer-fade">
      <div
        v-if="isShown"
        class="viewer-wrapper"
        @wheel.passive="handleScroll"
        @touchstart.passive="handleTouch"
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
        <div class="viewer-toolbar" @touchstart.stop.passive="null">
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
      </div> </transition
  ></Teleport>
</template>

<script setup lang="ts">
/// <reference path="../types.d.ts" />
import type { StyleValue } from "vue";
import { ref, computed, reactive, watch } from "vue";
import { useData } from "vitepress";
const { isDark } = useData();
const close = () => {
  isShown.value = false;
};
const props = defineProps<{
  src?: string;
  svg?: string;
  alt: string;
  initWidth: number;
  initHeight: number;
}>();
const isShown = defineModel<boolean>({
  required: true,
});

interface Range {
  min: number;
  max: number;
}
/** 缩放比例范围 */
const RANGE: Range = { min: 0.2, max: 2.5 } as const;
/** 双击缩放系数 */
const DOUBLETAP_RATIO = 2.5;
/** 双击时间间隔阈值 */
const DOUBLETAP_TIME = 200;
/** 触摸判断为点击时间长度阈值 */
const TAP_DURATION = 100;
/** 双击距离阈值 */
const DOUBLETAP_DISTANCE = 50;

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

const limitRange = (input: number, { min, max } = RANGE) =>
  input > max ? max : input < min ? min : input;
const convertRatio = (delta: number) =>
  delta > 0 ? 1 + delta : 1 / (1 - delta);

/** CSS 属性 */
const style = computed<StyleValue>(() => ({
  width: props.initWidth! + "px",
  height: props.initHeight! + "px",
  transform: `translate(${position.x - props.initWidth! / 2}px,${position.y - props.initHeight! / 2}px) scale(${scale.value})`,
}));
const transitionEnabled = ref(false);
const filterEnabled = ref(false);

// 维护窗口大小信息
const getWindowResize = () =>
  ([frame.width, frame.height] = [window.innerWidth, window.innerHeight]);
const getLimitRatio = (
  ...limitValues: {
    value: number;
    limit: number;
  }[]
) => Math.min(1, ...limitValues.map(({ value, limit }) => limit / value));

/** 监听开启关闭 */
watch(isShown, () => {
  if (import.meta.env.SSR) return;
  if (!isShown.value) return;

  getWindowResize();
  [position.x, position.y] = [frame.width / 2, frame.height / 2];
  scale.value = getLimitRatio(
    { value: props.initHeight!, limit: frame.height },
    { value: props.initWidth!, limit: frame.width }
  );
  filterEnabled.value = Boolean(
    isDark.value && !props.alt?.includes("&keep-color")
  );
});

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
  document.addEventListener("mousemove", onMouseMove, { passive: true });
  document.addEventListener("mouseup", onMouseUp, { passive: true });
};

// 触屏处理
type TouchDataDrag = {
  type: "drag";
  x: number;
  y: number;
};
type TouchDataZoom = {
  type: "zoom";
  x: number;
  y: number;
  distance: number;
};
const getDistance = (dx: number, dy: number) => (dx ** 2 + dy ** 2) ** 0.5;
const initTouchObj = (touches: TouchList): TouchData => {
  const t0 = {
    x: touches[0].clientX,
    y: touches[0].clientY,
  };
  if (touches.length === 1)
    return {
      type: "drag",
      x: t0.x - position.x,
      y: t0.y - position.y,
    };
  else {
    const t1 = {
      x: touches[1].clientX,
      y: touches[1].clientY,
    };
    return {
      type: "zoom",
      x: (t0.x + t1.x) / 2 - position.x,
      y: (t0.y + t1.y) / 2 - position.y,
      distance: getDistance(t1.x - t0.x, t1.y - t0.y),
    };
  }
};
type TouchData = TouchDataDrag | TouchDataZoom;
let onTouching: null | symbol = null;
let lastTap = {
    timeStamp: 0,
    position: { x: 0, y: 0 },
  },
  closeTimer: NodeJS.Timeout;
/** 触屏 */
const handleTouch = ({ touches }: TouchEvent) => {
  if (onTouching) return;
  const currentTouch = Symbol();
  let lastScale = scale.value;
  const timeStamp = Date.now();
  const originalPosition = { x: position.x, y: position.y };
  let begin = initTouchObj(touches);
  if (begin.type === "zoom") lastScale = scale.value;

  if (begin.type === "drag" && timeStamp - lastTap.timeStamp < DOUBLETAP_TIME) {
    // 判定为双击
    transitionEnabled.value = true;
    clearTimeout(closeTimer);
    const newScale = limitRange(
      scale.value * DOUBLETAP_RATIO > RANGE.max
        ? scale.value / DOUBLETAP_RATIO
        : scale.value * DOUBLETAP_RATIO
    );
    position.x += begin.x - (begin.x / scale.value) * newScale;
    position.y += begin.y - (begin.y / scale.value) * newScale;
    scale.value = newScale;
    return;
  }

  transitionEnabled.value = false;
  onTouching = currentTouch;
  const onTouchMove = ({ touches }: TouchEvent) => {
    if (!begin || onTouching !== currentTouch) return;
    if (touches.length === 1) {
      if (begin.type !== "drag") {
        begin = initTouchObj(touches);
        return;
      }
      position.x = touches[0].clientX - begin.x;
      position.y = touches[0].clientY - begin.y;
    } else if (touches.length === 2) {
      if (begin.type !== "zoom") {
        begin = initTouchObj(touches);
        return;
      }
      const dx = touches[1].clientX - touches[0].clientX;
      const dy = touches[1].clientY - touches[0].clientY;
      const newScale = limitRange(
        (lastScale * getDistance(dx, dy)) / begin.distance
      );
      const newPosition = {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
      };
      position.x = newPosition.x - begin.x * (newScale / lastScale);
      position.y = newPosition.y - begin.y * (newScale / lastScale);
      scale.value = newScale;
    }
  };
  const onTouchEnd = ({ touches }: TouchEvent) => {
    if (touches.length !== 0 || onTouching !== currentTouch) return;
    onTouching = null;
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
    if (
      begin.type === "drag" &&
      Date.now() - timeStamp < TAP_DURATION &&
      getDistance(
        originalPosition.x - position.x,
        originalPosition.y - position.y
      ) < DOUBLETAP_DISTANCE
    ) {
      // 判定为点击而非拖动
      if (!lastTap || timeStamp - lastTap.timeStamp > DOUBLETAP_TIME) {
        // 判断为单击
        closeTimer = setTimeout(() => {
          close();
        }, DOUBLETAP_TIME + TAP_DURATION);
        lastTap = {
          timeStamp: Date.now(),
          position: { x: position.x, y: position.y },
        };
      }
    }
  };
  document.addEventListener("touchmove", onTouchMove, { passive: true });
  document.addEventListener("touchend", onTouchEnd, { passive: true });
};
</script>
<style>
.viewer-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1750;
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
  background-image:
    linear-gradient(
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
  touch-action: none;
}
.viewer-img-inner.image {
  border-radius: 0;
}
</style>
