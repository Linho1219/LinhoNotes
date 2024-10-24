<template>
  <div class="mermaid" v-html="svgRef"></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import mermaid from "mermaid";
import { useData } from "vitepress";
const { isDark } = useData();

const props = defineProps({
  id: String,
  code: String,
});

const render = async (id: string, code: string) => {
  mermaid.initialize({ startOnLoad: false, theme: isDark ? "dark" : "forest" });
  const { svg } = await mermaid.render(id, code);
  return svg;
};
onMounted(async () => {
  svgRef.value = await render(props.id!, decodeURIComponent(props.code!));
});
const svgRef = ref("");
</script>
