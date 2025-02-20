<template>
  <ruby ref="textEle">
    <slot></slot>
    <rp>(</rp><rt>{{ display }}</rt
    ><rp>)</rp>
  </ruby>
</template>

<script setup lang="ts">
import pinyin from "pinyin";
import { onMounted, ref } from "vue";
const display = ref("");
const textEle = ref<HTMLSpanElement | null>(null);
const props = defineProps<{
  manual?: string,
  m?: string,
}>();
onMounted(() => {
  if (!textEle.value) return;
  const text = textEle.value.innerText;
  display.value =
    props.manual ??
    props.m ??
    pinyin(text, {
      heteronym: true,
      segment: true,
    })
      .flat()
      .join(" ");
});
</script>

<style>
ruby rp,
ruby rt {
  font-size: 0.7em;
  user-select: none;
}
</style>
