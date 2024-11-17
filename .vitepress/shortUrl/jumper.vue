<template></template>

<script setup lang="ts">
import axios from "axios";
import { onMounted } from "vue";
import { useRouter } from "vitepress";

const router = useRouter();
onMounted(() => {
  const id = window.location.search.match(/\?q=(.{10})$/)?.[1];
  if (id)
    axios.get("/shortmap.json").then(
      (res) => {
        if (typeof res.data[id] !== "undefined")
          router.go(`./${encodeURI(res.data[id])}`);
        else router.go(`./404`);
      },
      () => router.go(`./404`)
    );
  else router.go(`./404`);
});
</script>
