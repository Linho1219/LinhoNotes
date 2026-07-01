---
layout: false
head:
  - - meta
    - name: robots
      content: noindex
---

<Loading />
<ClientOnly><Jumper /></ClientOnly>

<script lang="ts" setup>
import Jumper from '@features/short-url/jumper.vue'
import Loading from '@features/short-url/loading.vue'
</script>
