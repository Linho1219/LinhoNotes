<template>
  <div class="graph" ref="shellRef">
    <GraphRender
      :id="props.id"
      :code="props.code"
      :graphWidth="width"
      :graphHeight="height"
    ></GraphRender>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import GraphRender from "./graphRender.vue";

const MAX_HEIGHT = 350,
  RATIO = 4 / 3;

const shellRef = ref<HTMLDivElement | null>(null);

const props = defineProps({
  id: String,
  code: String,
});
const width = ref(0),
  height = ref(0);

const handleResize = () => {
  if (shellRef.value && width.value !== shellRef.value.clientWidth) {
    width.value = shellRef.value.clientWidth;
    height.value =
      width.value * RATIO > MAX_HEIGHT ? MAX_HEIGHT : width.value * RATIO;
  }
};
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
</script>

<style>
.graph {
  width: 100%;
}
</style>
