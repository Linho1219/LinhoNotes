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
