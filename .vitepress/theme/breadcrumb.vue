<template>
  <div id="breadcrumb">
    <span
      v-for="item in items"
      class="bc-items"
      :id="item.first ? 'bc-project' : undefined"
      >{{ item.name }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
const { page } = useData();
import { ref, watchEffect } from "vue";
import { pangu } from "../util";

type Breadcrumb = {
  name: string;
  first: boolean;
};

const items = ref(<Breadcrumb[]>[]);
watchEffect(() => {
  items.value = page.value.filePath
    .split("/")
    .slice(0, -1)
    .map((item, index, arr) => ({
      name: pangu(item),
      first: !index,
    }));
});
</script>

<style>
#breadcrumb {
  margin-bottom: 15px;
  font-size: 15px;
  color: var(--vp-c-text-2);
}
.bc-items::after {
  content: "/";
  margin: 0 8px;
  vertical-align: top;
  font-weight: bold;
  font-size: 10px;
  color: var(--vp-c-text-3);
}
</style>
