<template></template>
<script setup lang="ts">
import { encodePagePath } from '#shared/short-url'
import legacyShortUrlMap from 'virtual:legacy-short-url-map'
import { useRouter } from 'vitepress'
import { onMounted } from 'vue'

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const legacyId = params.get('q')
  const path = legacyId && /^[0-9a-f]{10}$/.test(legacyId) ? legacyShortUrlMap[legacyId] : undefined

  useRouter().go(path === undefined ? '/404' : `/${encodePagePath(path)}`, { replace: true })
})
</script>
