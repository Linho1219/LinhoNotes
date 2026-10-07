<template></template>
<script setup lang="ts">
import { encodePagePath } from '#shared/short-url'
import shortUrlMap from 'virtual:short-url-map'
import { useRouter } from 'vitepress'
import { onMounted } from 'vue'

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const currentId = params.get('p')
  const legacyId = params.get('q')
  let path: string | undefined

  if (currentId && /^[0-9A-Za-z]{7}$/.test(currentId)) {
    path = shortUrlMap.current[currentId]
  } else if (legacyId && /^[0-9a-f]{10}$/.test(legacyId)) {
    path = shortUrlMap.legacy[legacyId]
  }

  useRouter().go(path === undefined ? '/404' : `/${encodePagePath(path)}`, { replace: true })
})
</script>
