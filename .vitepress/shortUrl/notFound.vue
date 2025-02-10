<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vitepress";
const router = useRouter();
onMounted(() => {
  const url = window.location.href;
  if (url.includes("%20")) router.go(url.replaceAll("%20", "-"));
});
</script>
