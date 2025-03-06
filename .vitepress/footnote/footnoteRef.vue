<template>
  <sup
    class="footnote-ref"
    @mouseenter.once="loadContent"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <a
      :href="`#fn${props.id}`"
      :id="`fnref${props.refid}`"
      class="footnote-link escape-animate"
      ref="linkEle"
    >
      {{ props.caption }}
    </a>
    <transition name="footnote-card-fade">
      <div
        class="footnote-ref-wrapper"
        :class="alignRight ? 'right' : 'left'"
        v-if="isLoaded"
        v-show="isHover && !isTouch"
      >
        <div class="footnote-ref-card escape-animate" v-html="content"></div>
      </div>
    </transition>
  </sup>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import emitter from "./mitt";
const props = defineProps<{
  id: string;
  refid: string;
  caption: string;
}>();
const isHover = ref(false),
  isLoaded = ref(false),
  content = ref(""),
  linkEle = ref<HTMLElement | null>(null),
  alignRight = ref(false),
  isTouch = ref(false);
function loadContent(event: PointerEvent) {
  if (event.pointerType === "touch") {
    isTouch.value = true;
    return;
  }
  const handleEvent = (footContent: string) => {
    content.value = footContent.replace(/(^<p>)|(<\/p>$)/g, "");
    isLoaded.value = true;
    emitter.off("on-return-footnote", handleEvent);
  };
  emitter.on("on-return-footnote", handleEvent);
  emitter.emit("on-query-footnote", props.id!);
}
watch(isHover, (hover) => {
  if (!hover || !linkEle.value) return;
  const rect = linkEle.value.getBoundingClientRect();
  const rightDistance = window.innerWidth - rect.right;
  if (rightDistance < 410) alignRight.value = true;
  else alignRight.value = false;
  console.log(rightDistance);
});
</script>

<style>
.footnote-ref {
  margin: 0 2px;
  position: relative;
  user-select: none;
}
.footnote-link {
  padding: 0 2px;
  background: var(--link-soft);
  color: var(--link-color) !important;
  text-decoration: none !important;
  border-radius: 3px;
  font-style: normal;
  line-height: 1em;
  transition: box-shadow 0.2s;
}
.footnote-link:hover {
  background: var(--link-soft);
}
.footnote-link .brackets {
  display: none;
}
.footnote-link::before,
.footnote-link::after {
  opacity: 0.4;
}
.footnote-link::before {
  content: "[";
}
.footnote-link::after {
  content: "]";
}
.footnote-link:active {
  opacity: 0.5;
  transition: none;
}

.footnote-ref-wrapper {
  position: absolute;
  top: calc(100% + 8px);
  z-index: 198;
}

.footnote-ref-wrapper.left {
  left: calc(50% - 13px);
}

.footnote-ref-wrapper.right {
  right: calc(50% - 13px);
}

.footnote-ref-wrapper::after {
  content: "";
  width: 16px;
  height: 10px;
  display: block;
  position: absolute;
  top: -8px;
  border-bottom: var(--vp-c-bg-elv) 2px solid;

  background-image:
    linear-gradient(
      -45deg,
      var(--vp-c-bg-elv) calc(50% - 1px),
      var(--vp-c-divider) calc(50% - 1px),
      var(--vp-c-divider) calc(50%),
      transparent calc(50%)
    ),
    linear-gradient(
      45deg,
      var(--vp-c-bg-elv) calc(50% - 1px),
      var(--vp-c-divider) calc(50% - 1px),
      var(--vp-c-divider) calc(50%),
      transparent calc(50%)
    );
  background-position:
    top left,
    top right;
  background-repeat: no-repeat;
  background-size: 50% 100%;
}

.footnote-ref-wrapper.left::after {
  left: 5px;
}

.footnote-ref-wrapper.right::after {
  right: 5px;
}

.footnote-ref-wrapper::before {
  content: "";
  width: 100%;
  height: 10px;
  display: block;
  position: absolute;
  top: -8px;
  left: 0;
  background: transparent;
  z-index: -1;
}

.footnote-ref-card {
  padding: 8px 12px;
  max-width: 400px;
  width: max-content;
  background: var(--vp-c-bg-elv);
  border: var(--vp-c-divider) 1px solid;
  box-shadow: var(--vp-shadow-3);
  border-radius: 5px;
  font-weight: normal;
  text-decoration: none;
  font-style: normal;
  font-size: 16px;
  line-height: 1.5em;
  transition: transform 0.2s;
}

.footnote-ref-card .footnote-backref {
  display: none;
}
.footnote-card-fade-enter-active {
  opacity: 0;
  transition: opacity 0.2s;
}
.footnote-card-fade-leave-active {
  opacity: 0 !important;
  transition: opacity 0.2s;
}
.footnote-card-fade-enter-to {
  opacity: 1;
}
</style>
