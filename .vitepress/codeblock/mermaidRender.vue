<template>
    <div class="mermaid_container" v-html="svgRef"></div>
    <div
      v-if="errorFlag"
      class="mermaid-error caution custom-block github-alert"
    >
      <p class="custom-block-title">Mermaid 渲染错误</p>
      <pre v-html="errorDetails"></pre>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import mermaid from "mermaid";
import { useData } from "vitepress";
const { isDark } = useData();

const svgRef = ref(""),
  errorFlag = ref(false),
  errorDetails = ref("");

const props = defineProps({
  id: String,
  code: String
});

const render = async () => {
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark.value ? "dark" : "neutral",
    });
    svgRef.value = (
      await mermaid.render(props.id!, decodeURIComponent(props.code!))
    ).svg;
  } catch (e) {
    errorFlag.value = true;
    errorDetails.value = e.toString().replace("\n", "<br/>");
  }
};

onMounted(render);
</script>
