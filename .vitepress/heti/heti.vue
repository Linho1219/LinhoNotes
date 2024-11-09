<script lang="ts" setup>
/// <reference path="../types.d.ts" />
import { useData } from "vitepress";
const { page } = useData();
import { watch, onMounted } from "vue";

if (!import.meta.env.SSR) {
  const { Heti } = await import("./heti-addon");
  const space = () => new Heti(".vp-doc").autoSpacing();
  watch(page, space);
  onMounted(space());
  window.onload = space;
}
</script>

<style>
heti-spacing {
  display: inline;
}
heti-spacing + sup,
heti-spacing + sub {
  margin-inline-start: 0;
}
.heti-spacing-start {
  margin-inline-end: 0.25em;
}
.heti-spacing-end {
  margin-inline-start: 0.25em;
}
heti-adjacent {
  display: inline;
}
.heti-adjacent-half {
  margin-inline-end: -0.5em;
}
.heti-adjacent-quarter {
  margin-inline-end: -0.25em;
}
</style>

<template></template>
