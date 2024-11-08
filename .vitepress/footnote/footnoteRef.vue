<template>
  <sup
    class="footnote-ref"
    @mouseover.once="loadContent"
    @mouseover="isHover || (isHover = true)"
    @mouseout="isHover && (isHover = false)"
  >
    <a
      :href="`#fn${props.id}`"
      :id="`fnref${props.refid}`"
      class="footnote-link escape-animate"
    >
      {{ props.caption }}
    </a>
    <transition name="footnote-card-fade">
      <div
        v-if="isLoaded"
        v-show="isHover"
        class="footnote-ref-card escape-animate"
        v-html="content"
      ></div>
    </transition>
  </sup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import emitter from "./mitt";
const props = defineProps({
  id: String,
  refid: String,
  caption: String,
});
const isHover = ref(false),
  isLoaded = ref(false),
  content = ref("");
function loadContent(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  console.log("query", props.id!);
  const handleEvent = (footContent: string) => {
    console.log("get", footContent);
    content.value = footContent.replace(/(^<p>)|(<\/p>$)/g, "");
    isLoaded.value = true;
    emitter.off("on-return-footnote", handleEvent);
  };
  emitter.on("on-return-footnote", handleEvent);
  emitter.emit("on-query-footnote", props.id!);
}
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

.footnote-ref-card {
  position: absolute;
  display: block;
  left: calc(50% - 13px);
  top: calc(100% + 8px);
  padding: 6px 12px;
  max-width: 20em;
  width: max-content;
  background: var(--vp-c-bg-elv);
  border: var(--vp-c-divider) 1px solid;
  box-shadow: var(--vp-shadow-3);
  border-radius: 5px;
  z-index: 700;
  font-weight: normal;
  text-decoration: none;
  font-style: normal;
  font-size: 16px;
}

.footnote-ref-card::before {
  content: "";
  width: 16px;
  height: 8px;
  display: block;
  position: absolute;
  top: -8px;
  left: 5px;
  background-image: linear-gradient(
      -45deg,
      var(--vp-c-bg-elv) 45%,
      var(--vp-c-divider) 45%,
      var(--vp-c-divider) 55%,
      transparent 55%
    ),
    linear-gradient(
      45deg,
      var(--vp-c-bg-elv) 45%,
      var(--vp-c-divider) 45%,
      var(--vp-c-divider) 55%,
      transparent 55%
    );
  background-position: top left, top right;
  background-repeat: no-repeat;
  background-size: 50% 100%;
}

.footnote-ref-card::after {
  content: "";
  width: 100%;
  height: 10px;
  display: block;
  position: absolute;
  top: -8px;
  left: 0;
  background: transparent;
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

.footnote-ref-card a {
  color: var(--link-color);
  vertical-align: baseline;
  text-decoration: none;
  position: relative;
  border-radius: 2px;
  transition: background 0.2s;
}
.footnote-ref-card a:hover {
  color: var(--link-color) !important;
  background: var(--link-soft);
  opacity: 1 !important;
}
.footnote-ref-card a:active {
  opacity: 0.6 !important;
}
</style>
