<template>
  <div v-if="display" class="formula-block" v-html="html"></div>
  <span v-else class="formula-inline" v-html="html"></span>
</template>

<script setup lang="ts">
import { mathMacros } from '#shared/math'
import katex from 'katex'
import 'katex/contrib/mhchem'

const props = defineProps<{
  code: string
  display?: boolean
}>()

const html = katex.renderToString(props.code, {
  displayMode: props.display,
  macros: mathMacros,
  output: 'html',
  strict: false,
  throwOnError: true,
  trust: false,
})
</script>

<style lang="scss">
// CSS trick
// KaTeX 有时在测量时会出现问题，导致上下溢出
// 但横向需要滚动，纵向不能设为 visible
// 正文部分存在 margin 合并
// 如果直接添加 padding 并减小 margin，则会多出 padding
// 因此外层使用 margin 用于合并
// 内层使用负 margin + padding，将内容框向上下拓展 0.5em
// 重复类名用于提升优先级

.formula-block {
  margin: 1em 0;
}
.katex-display.katex-display {
  margin: -0.5em 0;
  padding: 0.5em 0;
}
</style>
