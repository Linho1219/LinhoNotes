<template>
  <span class="VPBadge ln" :class="BadgeClass"> {{ BadgeText }} <slot></slot> </span>
</template>

<script setup lang="ts">
import { PaletteJSON } from '@theme/features/utils/palette'
import { ref, useAttrs } from 'vue'

const props = defineProps<{
  color?: string
  c?: string
  text?: string
  t?: string
}>()
const colorNames = Object.keys(PaletteJSON.light.text)

let colorStr = ''
const attrs = useAttrs()
for (let key in attrs)
  if (typeof attrs[key] === 'string' && colorNames.includes(key)) colorStr = key

colorStr = props.color ?? props.c ?? colorStr

const BadgeClass = ref(colorStr),
  BadgeText = ref(props.text ?? props.t)
</script>

<style scoped lang="scss">
.VPBadge.ln {
  margin-left: 0px;
  margin-right: 0px;
  color: var(--ln-c-gray);
  background: var(--ln-c-gray-soft);
}

$colors:
  red, orange, yellow, green, blue, indigo, purple, pink, magenta, lime, olive, cyan, teal, claret,
  brown, gray;

@each $color in $colors {
  .VPBadge.ln.#{$color} {
    color: var(--ln-c-#{$color});
    background: var(--ln-c-#{$color}-soft);
  }
}
</style>
