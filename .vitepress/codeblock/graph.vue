<template>
  <div class="graph" ref="shellRef">
    <GraphRender
      :id="props.id"
      :code="decodeURIComponent(props.code)"
      :graphWidth="width"
      :graphHeight="height"
    />
    <button class="graphExternal" @click="openInExternal">
      <span class="icon vpi-square-pen edit-link-icon"></span>
      在外部打开
    </button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import GraphRender from "./graphRender.vue";
import base64 from "base-64";
import utf8 from "utf8";
import JSON5 from "json5";

const MAX_HEIGHT = 350,
  RATIO = 0.75;

const shellRef = ref<HTMLDivElement | null>(null);

const props = defineProps<{
  id: string;
  code: string;
}>();
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

import { globalConfig } from "@/manualConfig";
function openInExternal() {
  const miniCode = JSON5.stringify(JSON5.parse(decodeURIComponent(props.code)));
  const query = base64.encode(utf8.encode(miniCode)).replace(/=+$/g, "");
  window.open(globalConfig.externalGraphPrefix + query, "_blank", "popup");
}
</script>

<style>
.graph {
  width: 100%;
  position: relative;
}
.graphExternal {
  color: var(--vp-c-brand);
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.3em 0.6em;
  position: absolute;
  bottom: 25px;
  right: 20px;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.graphExternal:hover {
  background-color: var(--vp-c-brand-soft);
}
.graphExternal:active {
  filter: brightness(0.6);
}
.graphExternal .icon {
  display: inline-block;
  width: 1em;
  height: 1em;
}
</style>
