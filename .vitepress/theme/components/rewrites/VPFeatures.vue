<script setup lang="ts">
import VPFeature from './VPFeature.vue'
import type { DefaultTheme } from 'vitepress/theme'
import { computed } from 'vue'

export interface Feature {
  icon?: DefaultTheme.FeatureIcon
  title: string
  details: string
  link?: string
  linkText?: string
  rel?: string
  target?: string
  archived?: boolean
}

const props = defineProps<{
  features: Feature[]
}>()

const groups = computed(() => [
  { title: '更新中', features: props.features.filter((f) => !f.archived) },
  { title: '已完结', features: props.features.filter((f) => f.archived) },
])
</script>

<template>
  <div v-if="features" class="VPFeatures">
    <div class="container" v-for="group in groups" :key="group.title">
      <h2 class="group-title">{{ group.title }}</h2>
      <ul class="items">
        <li v-for="feature in group.features" :key="feature.title" class="item grid-4">
          <VPFeature
            :icon="feature.icon"
            :title="feature.title"
            :details="feature.details"
            :link="feature.link"
            :link-text="feature.linkText"
            :rel="feature.rel"
            :target="feature.target"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.VPFeatures {
  position: relative;
  padding: 0 1.5rem;
}

@media (min-width: 40rem) {
  .VPFeatures {
    padding: 0 3rem;
  }
}

@media (min-width: 60rem) {
  .VPFeatures {
    padding: 0 4rem;
  }
}

.container {
  margin: 0 auto;
  max-width: 72rem;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -0.5rem;
}

.item {
  padding: 0.5rem;
  width: 100%;
}

@media (min-width: 40rem) {
  .item.grid-2,
  .item.grid-4,
  .item.grid-6 {
    width: calc(100% / 2);
  }
}

@media (min-width: 48rem) {
  .item.grid-2,
  .item.grid-4 {
    width: calc(100% / 2);
  }

  .item.grid-3,
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

@media (min-width: 60rem) {
  .item.grid-4 {
    width: calc(100% / 4);
  }
}

.group-title {
  margin: 2rem 0 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
