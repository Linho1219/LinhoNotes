<template>
  <li :id="`fn${props.id}`" class="footnote-item" ref="liRef">
    <slot></slot>
  </li>
</template>

<script setup lang="ts">
import emitter from "./mitt";
import { onMounted, onUnmounted, ref } from "vue";
const props = defineProps<{
  id: string;
}>();
const liRef = ref<HTMLDivElement | null>(null);
const handleEvent = (id: string) => {
  if (id === props.id && liRef.value !== null)
    emitter.emit("on-return-footnote", liRef.value.innerHTML);
};
onMounted(() => emitter.on("on-query-footnote", handleEvent));
onUnmounted(() => emitter.off("on-query-footnote", handleEvent));
</script>
