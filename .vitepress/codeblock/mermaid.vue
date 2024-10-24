<template>
  <div class="mermaid">
    <MermaidRender
      :id="props.id"
      :code="props.code"
      :key="Number(isDark)"
    ></MermaidRender>
  </div>
</template>
<script setup lang="ts">
import MermaidRender from "./mermaidRender.vue";
import { useData } from "vitepress";
const { isDark } = useData();
const props = defineProps({
  id: String,
  code: String,
});
</script>
