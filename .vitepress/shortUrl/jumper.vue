<script setup lang="ts">
import axios from "axios";
import { onMounted } from "vue";
import { useRouter } from "vitepress";
const router = useRouter();
onMounted(() => {
  if (!import.meta.env.SSR) {
    const id = window.location.search.match(/\?q=(.{10})$/)?.[1];
    if (id)
      axios.get("/shortmap.json").then((res) => {
        router.go(`./${encodeURI(res.data[id])}`);
      });
    else router.go(`./404`);
  }
});
</script>
