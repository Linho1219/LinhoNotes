<template>
  <Layout>
    <template #doc-before>
      <Breadcrumb />
    </template>
    <template #doc-footer-before>
      <Contributors />
    </template>
    <template #layout-top>
      <NolebaseHighlightTargetedHeading />
    </template>
    <template #layout-bottom>
      <SearchOverlay />
      <div id="imageViewers"></div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Breadcrumb from '@components/breadcrumb.vue'
import Contributors from '@components/contributors.vue'
import SearchOverlay from '@components/searchOverlay.vue'
import { NolebaseHighlightTargetedHeading } from '@nolebase/vitepress-plugin-highlight-targeted-heading/client'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { nextTick, onUnmounted, provide, watch } from 'vue'

const { Layout } = DefaultTheme
const { isDark } = useData()

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async () => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready
  document.documentElement.animate(
    { opacity: isDark.value ? [1, 0] : [0, 1] },
    {
      duration: 600,
      easing: 'ease-out',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
  )
})

const router = useRouter()
let lastPath = router.route.path
let lastHash = router.route.hash
let smoothScrollTimeout: number | null = null

function enableSmoothScroll() {
  if (smoothScrollTimeout) clearTimeout(smoothScrollTimeout)
  document.documentElement.classList.add('hash-scroll-smooth')
  smoothScrollTimeout = window.setTimeout(() => {
    document.documentElement.classList.remove('hash-scroll-smooth')
    smoothScrollTimeout = null
  }, 1000)
}

watch([() => router.route.hash, () => router.route.path], () => {
  if (router.route.hash !== lastHash && router.route.path === lastPath) enableSmoothScroll()

  lastHash = router.route.hash
  lastPath = router.route.path
})

onUnmounted(() => {
  if (smoothScrollTimeout) clearTimeout(smoothScrollTimeout)
})
</script>

<style>
html.hash-scroll-smooth {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html.hash-scroll-smooth {
    scroll-behavior: auto;
  }
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}
::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}
</style>
