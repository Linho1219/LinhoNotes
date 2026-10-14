<template>
  <div class="share-panel">
    <noscript>{{ i.global.javascriptDisabled }}</noscript>
    <button class="copylink" @click="copyLink()">
      <span class="copylink-text">{{ i.share.copyLink }}</span>
      <span class="copy-indicator-wrapper" :class="expand ? 'expanded' : 'folded'">
        <svg class="copy-indicator" viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M9 18.25a.74.74 0 0 1-.53-.25l-5-5a.75.75 0 1 1 1.06-1L9 16.44L19.47 6a.75.75 0 0 1 1.06 1l-11 11a.74.74 0 0 1-.53.25"
          />
        </svg>
      </span>
    </button>
    <ClientOnly>
      <QRCodeVue
        class="qrcode"
        :value="link"
        :size="120"
        render-as="svg"
        level="L"
        background="transparent"
        :foreground="foreground"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { createShareUrl } from '#shared/short-url'
import site from '#shared/site.json'
import i from '@theme/component-i18n.json'
import QRCodeVue from 'qrcode.vue'
import { useData } from 'vitepress'
import { onMounted, ref, watchEffect } from 'vue'

const { page, isDark } = useData()
const link = ref('')
const expand = ref(false)
const foreground = ref('')
let timer: NodeJS.Timeout | false = false

function copyLink() {
  navigator.clipboard.writeText(link.value).then(() => {
    expand.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      expand.value = timer = false
    }, 1500)
  })
}

onMounted(() => {
  watchEffect(() => {
    link.value = createShareUrl(
      import.meta.env.DEV ? location.origin : site.baseUrl, // 方便开发环境测试
      page.value.filePath,
    )
  })
  watchEffect(() => {
    foreground.value = isDark.value ? '#D3D3CC' : '#3C3C43'
  })
})
</script>

<style lang="scss">
.share-panel {
  display: flex;
  flex-direction: column;
  .copylink {
    display: block;
  }

  @media only screen and (min-width: 768px) {
    & {
      margin: -0.75rem;
    }
    .copylink {
      height: 40px;
      line-height: 40px;
      font-size: 14px;

      color: var(--vp-c-text-1);
      background-color: #75798e10;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      border-bottom: var(--vp-c-divider) 1px solid;

      transition: background-color 0.2s;

      &:hover {
        background-color: #c2c7e614;
      }
      &:active {
        background-color: #30323a10;
        transition: background-color 0.05s;
      }
    }
    .qrcode {
      margin: 1rem;
    }
  }

  @media only screen and (max-width: 768px) {
    & {
      margin: 0.5rem 0;
      gap: 1rem;
      flex-direction: column-reverse;
    }
    .copylink {
      width: 100%;
      padding: 8px 0;
      line-height: 18px;
      font-size: 14px;

      background-color: var(--vp-c-bg-soft);
      border-radius: 3px;
      border: var(--vp-c-divider) 1px solid;
    }
    .qrcode {
      margin: 0 auto;
    }
  }

  .qrcode {
    border-radius: 3px;
  }

  .copy-indicator {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 18px;
    color: var(--ln-c-green);
  }
  .copy-indicator-wrapper {
    display: inline-block;
    overflow: hidden;
    vertical-align: middle;
    height: 18px;
    width: 18px;
    margin-bottom: 2px;
    position: relative;
    transition: max-width 0.3s cubic-bezier(0, 0.5, 0.5, 1);
    &.folded {
      max-width: 0;
      transform: translateX(3px);
    }
    &.expanded {
      max-width: 18px;
      margin-left: 3px;
    }
  }
}
</style>
