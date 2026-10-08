<template>
  <div v-if="display" class="formula-block" v-html="html"></div>
  <span v-else class="formula-inline" v-html="html"></span>
</template>

<script setup lang="ts">
import { mathMacros } from '#shared/math'
import katex from 'katex'
import 'katex/contrib/mhchem'
import { computed } from 'vue'

const props = defineProps<{
  code: string
  display?: boolean
}>()

const html = computed(() =>
  katex.renderToString(decodeURIComponent(props.code), {
    displayMode: props.display,
    macros: mathMacros,
    output: 'html',
    strict: false,
    throwOnError: true,
    trust: false,
  }),
)
</script>
