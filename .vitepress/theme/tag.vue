<template>
  <span class="VPBadge" :class="props.color ?? props.c">{{
    props.text ?? props.t
  }}</span>
</template>

<script setup lang="ts">
const props = defineProps({
  color: String,
  text: String,
  c: String,
  t: String,
});
</script>

<style>
.VPBadge {
  margin-left: 0;
  margin-right: 5px;
}
h1 .VPBadge,
h2 .VPBadge,
h3 .VPBadge,
h4 .VPBadge,
h5 .VPBadge,
h6 .VPBadge {
  margin-left: 3px;
  margin-right: 3px;
}
.VPBadge,
.VPBadge.gray {
  color: var(--vp-c-text-2);
  background: var(--vp-c-gray-soft);
}
.VPBadge.red {
  color: var(--vp-c-red-2);
  background: var(--vp-c-red-soft);
}
.VPBadge.orange {
  color: #ff6030;
  background: rgba(255, 125, 33, 0.16);
}
.VPBadge.yellow {
  color: var(--vp-c-yellow-2);
  background: var(--vp-c-yellow-soft);
}
.dark .VPBadge.yellow {
  color: var(--vp-c-yellow-1);
}
.VPBadge.green {
  color: var(--vp-c-green-2);
  background: var(--vp-c-green-soft);
}
.VPBadge.blue {
  color: #50a8ff;
  background: rgba(72, 151, 255, 0.16);
}
.VPBadge.indigo {
  color: var(--vp-c-indigo-1);
  background: var(--vp-c-indigo-soft);
}
.VPBadge.purple {
  color: var(--vp-c-purple-1);
  background: var(--vp-c-purple-soft);
}
.VPBadge.pink {
  color: var(--vp-c-red-3);
  background: rgba(255, 133, 133, 0.16);
}
.dark .VPBadge.pink {
  color: var(--vp-c-red-1);
  background: rgba(255, 133, 133, 0.16);
}
.VPBadge.magenta {
  color: #ff53ac;
  background: rgba(255, 72, 148, 0.16);
}
.VPBadge.lime {
  color: #86a822;
  background: rgba(161, 197, 69, 0.16);
}
.dark .VPBadge.lime {
  color: #94bb1e;
}
.VPBadge.olive {
  color: #808000;
  background: rgba(100, 124, 38, 0.16);
}
.dark .VPBadge.olive {
  color: #aaaa00;
  background: rgba(187, 206, 93, 0.16);
}
.VPBadge.cyan {
  color: #29b8db;
  background: rgba(41, 215, 234, 0.16);
}
.VPBadge.teal {
  color: #008080;
  background: rgba(37, 162, 167, 0.16);
}
.dark .VPBadge.teal {
  color: #00a1a1;
}
</style>
