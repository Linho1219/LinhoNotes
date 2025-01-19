<template>
  <div class="share-panel">
    <noscript>{{ miscI18n.javascriptDisabled }}</noscript>
    <QRCodeVue
      :value="link"
      :size="120"
      render-as="svg"
      level="L"
      background="transparent"
      :foreground="foreground"
    />
    <button class="copylink" @click="copyLink()">
      {{ miscI18n.copyLink
      }}<span
        class="copy-indicator-wrapper"
        :class="expand ? 'expanded' : 'folded'"
      >
        <svg class="copy-indicator" viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M9 18.25a.74.74 0 0 1-.53-.25l-5-5a.75.75 0 1 1 1.06-1L9 16.44L19.47 6a.75.75 0 0 1 1.06 1l-11 11a.74.74 0 0 1-.53.25"
          />
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import QRCodeVue from "qrcode.vue";
import md5 from "blueimp-md5";
import { ref, watchEffect, onMounted } from "vue";
import { useData } from "vitepress";
import { globalConfig } from "../manualConfig";
import { miscI18n } from "../i18n";

const { page, isDark } = useData();
const link = ref("");
const expand = ref(false);
const foreground = ref("");
let timer: NodeJS.Timeout | false = false;

function copyLink() {
  navigator.clipboard.writeText(link.value).then(() => {
    expand.value = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      expand.value = timer = false;
    }, 1500);
  });
}

onMounted(() => {
  watchEffect(() => {
    const path = page.value.filePath.replace(/(index)?\.md$/, "");
    if (encodeURI(path).length < 10)
      link.value = `${globalConfig.baseUrl}/${encodeURI(path)}`;
    else link.value = `${globalConfig.baseUrl}/s?q=${md5(path).slice(0, 10)}`;
  });
  watchEffect(() => {
    foreground.value = isDark.value ? "#D3D3CC" : "#3C3C43";
  });
});
</script>

<style>
.share-panel > svg {
  border-radius: 3px;
  margin: 0 auto;
  margin-bottom: 15px;
}

.share-panel .copy-indicator {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 18px;
  color: var(--ln-c-green);
}

.share-panel .copy-indicator-wrapper {
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  height: 18px;
  width: 18px;
  margin-bottom: 2px;
  position: relative;
  transition: max-width 0.3s cubic-bezier(0, 0.5, 0.5, 1);
}

.share-panel .copy-indicator-wrapper.folded {
  max-width: 0;
  transform: translateX(3px);
}

.share-panel .copy-indicator-wrapper.expanded {
  max-width: 18px;
  margin-left: 3px;
}

@media only screen and (min-width: 768px) {
  .share-panel {
    padding: 6px;
    height: 170px;
  }
  .share-panel .copylink {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40px;

    color: var(--vp-c-text-1);
    background: #75798e10;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top: var(--vp-c-divider) 1px solid;

    transition: background 0.2s;
  }
  .share-panel .copylink:hover {
    background: #c2c7e614;
  }
  .share-panel .copylink:active {
    background: #30323a10;
    transition: background 0.05s;
  }
}

@media only screen and (max-width: 768px) {
  .share-panel {
    margin-top: 10px;
  }
  .share-panel .copylink {
    display: block;
    width: 100%;
    padding: 8px 0;
    line-height: 18px;

    background: var(--vp-c-bg-soft);
    border-radius: 3px;
    border: var(--vp-c-divider) 1px solid;
  }
}
</style>
