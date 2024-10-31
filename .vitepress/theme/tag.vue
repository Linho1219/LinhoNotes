<template>
  <span class="VPBadge ln" :class="BadgeClass">
    {{ BadgeText }} <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { ref, useAttrs } from "vue";
const props = defineProps({
  color: String,
  text: String,
  c: String,
  t: String,
});
const colorNames = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
  "magenta",
  "lime",
  "olive",
  "cyan",
  "teal",
  "gray",
];

let colorStr = "";
const attrs = useAttrs();
for (let key in attrs)
  if (typeof attrs[key] === "string" && colorNames.includes(key))
    colorStr = key;

colorStr = props.color ?? props.c ?? colorStr;

const BadgeClass = ref(colorStr),
  BadgeText = ref(props.text ?? props.t);
</script>

<style>
.VPBadge.ln {
  margin-left: 0px;
  margin-right: 0px;
}
.VPBadge {
  --ln-c-red: var(--vp-c-red-2);
  --ln-c-red-soft: var(--vp-c-red-soft);
  --ln-c-orange: #d55c37;
  --ln-c-orange-soft: rgba(255, 146, 68, 0.16);
  --ln-c-yellow: var(--vp-c-yellow-2);
  --ln-c-yellow-soft: var(--vp-c-yellow-soft);
  --ln-c-green: var(--vp-c-green-2);
  --ln-c-green-soft: var(--vp-c-green-soft);
  --ln-c-blue: #3573b2;
  --ln-c-blue-soft: rgba(72, 151, 255, 0.16);
  --ln-c-indigo: var(--vp-c-indigo-1);
  --ln-c-indigo-soft: var(--vp-c-indigo-soft);
  --ln-c-purple: var(--vp-c-purple-1);
  --ln-c-purple-soft: var(--vp-c-purple-soft);
  --ln-c-pink: var(--vp-c-red-3);
  --ln-c-pink-soft: rgba(255, 133, 133, 0.16);
  --ln-c-magenta: #ff53ac;
  --ln-c-magenta-soft: rgba(255, 69, 174, 0.16);
  --ln-c-lime: #86a822;
  --ln-c-lime-soft: rgba(161, 197, 69, 0.16);
  --ln-c-olive: olive;
  --ln-c-olive-soft: rgba(100, 124, 38, 0.16);
  --ln-c-cyan: #138aa7;
  --ln-c-cyan-soft: rgba(44, 182, 197, 0.16);
  --ln-c-teal: teal;
  --ln-c-teal-soft: rgba(37, 162, 167, 0.16);
  --ln-c-gray: var(--vp-c-text-2);
  --ln-c-gray-soft: var(--vp-c-gray-soft);
}
.dark .VPBadge {
  --ln-c-orange: #ff7044;
  --ln-c-yellow: var(--vp-c-yellow-1);
  --ln-c-green:#3abf7f;
  --ln-c-blue: #5badff;
  --ln-c-pink: var(--vp-c-red-1);
  --ln-c-pink-soft: rgba(255, 133, 133, 0.16);
  --ln-c-lime: #9fc726;
  --ln-c-olive: #baba15;
  --ln-c-olive-soft: rgba(187, 206, 93, 0.16);
  --ln-c-cyan: #29b8db;
  --ln-c-cyan-soft: rgba(41, 215, 234, 0.16);
  --ln-c-teal: #18bebe;
  --ln-c-gray: var(--vp-c-text-2);
  --ln-c-gray-soft: var(--vp-c-gray-soft);
}
.VPBadge.ln {
  color: var(--ln-c-gray);
  background: var(--ln-c-gray-soft);
}
.VPBadge.ln.red {
  color: var(--ln-c-red);
  background: var(--ln-c-red-soft);
}
.VPBadge.ln.orange {
  color: var(--ln-c-orange);
  background: var(--ln-c-orange-soft);
}
.VPBadge.ln.yellow {
  color: var(--ln-c-yellow);
  background: var(--ln-c-yellow-soft);
}
.VPBadge.ln.green {
  color: var(--ln-c-green);
  background: var(--ln-c-green-soft);
}
.VPBadge.ln.blue {
  color: var(--ln-c-blue);
  background: var(--ln-c-blue-soft);
}
.VPBadge.ln.indigo {
  color: var(--ln-c-indigo);
  background: var(--ln-c-indigo-soft);
}
.VPBadge.ln.purple {
  color: var(--ln-c-purple);
  background: var(--ln-c-purple-soft);
}
.VPBadge.ln.pink {
  color: var(--ln-c-pink);
  background: var(--ln-c-pink-soft);
}
.VPBadge.ln.magenta {
  color: var(--ln-c-magenta);
  background: var(--ln-c-magenta-soft);
}
.VPBadge.ln.lime {
  color: var(--ln-c-lime);
  background: var(--ln-c-lime-soft);
}
.VPBadge.ln.olive {
  color: var(--ln-c-olive);
  background: var(--ln-c-olive-soft);
}
.VPBadge.ln.cyan {
  color: var(--ln-c-cyan);
  background: var(--ln-c-cyan-soft);
}
.VPBadge.ln.teal {
  color: var(--ln-c-teal);
  background: var(--ln-c-teal-soft);
}
.VPBadge.ln.gray {
  color: var(--ln-c-gray);
  background: var(--ln-c-gray-soft);
}
</style>
