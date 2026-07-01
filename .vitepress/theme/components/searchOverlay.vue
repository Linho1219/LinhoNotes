<template>
  <transition name="fade">
    <div v-if="isActive" class="search-overlay"></div>
  </transition>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";

const isActive = ref(false);
if (!import.meta.env.SSR) {
  const observer = new MutationObserver(() => {
    isActive.value = document.body.classList.contains("DocSearch--active");
  });
  observer.observe(document.body, { attributes: true });
  onUnmounted(() => observer.disconnect());
}
</script>

<style scoped>
:root:root:root {
  --docsearch-container-background: transparent;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--vp-backdrop-bg-color);
  z-index: 399;
  opacity: 0.4;
  transition: opacity 0.2s;
}
.fade-enter-active,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to {
  opacity: 0.4;
}
@media screen and (max-width: 760px) {
  .search-overlay {
    display: none;
  }
}
</style>
