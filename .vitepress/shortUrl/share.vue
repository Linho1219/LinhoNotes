<template>
  <div class="share-panel">
    <QRCodeVue
      :value="link"
      :size="120"
      render-as="svg"
      level="L"
      :background="background"
      :foreground="foreground"
    />
    <button class="copylink" @click="copyLink()">
      复制链接<span
        class="copy-indicator-wrapper"
        :class="expand ? 'expanded' : 'folded'"
      >
        <svg
          class="copy-indicator"
          viewBox="0 0 1024 1024"
          width="18"
          height="18"
        >
          <path
            d="M401.3 690.5L189.5 478.6l-0.4-0.4c-14.1-13.7-36.6-13.5-50.5 0.4-14.1 14.1-14.1 36.9 0 50.9l237.3 237.3 0.4 0.4c14.1 13.7 36.6 13.5 50.5-0.4l458.7-458.7 0.4-0.4c13.7-14.1 13.5-36.6-0.4-50.5-14.1-14.1-36.9-14.1-50.9 0L401.3 690.5z"
          />
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
/// <reference path="../types.d.ts" />
import QRCodeVue from "qrcode.vue";
import md5 from "blueimp-md5";
import { ref, watchEffect, onMounted } from "vue";
import { useData } from "vitepress";
import { baseUrl } from "../util";
const { page, isDark } = useData();
const link = ref("");
const expand = ref(false);
const foreground = ref(""),
  background = ref("");

let timer: NodeJS.Timeout | false = false;
function copyLink() {
  if (!import.meta.env.SSR) {
    navigator.clipboard.writeText(link.value).then(() => {
      expand.value = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        expand.value = timer = false;
      }, 1500);
    });
  }
}

onMounted(() => {
  watchEffect(() => {
    const path = page.value.filePath.replace(/(index)?\.md$/, "");
    if (encodeURI(path).length < 10)
      link.value = `${baseUrl}/${encodeURI(path)}`;
    else {
      const hash = md5(path).slice(0, 10);
      link.value = `${baseUrl}/s?q=${hash}`;
    }
  });
  watchEffect(() => {
    background.value = isDark.value ? "#202127" : "#ffffff";
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
}

.share-panel .copy-indicator path {
  fill: var(--ln-c-green);
}

.share-panel .copy-indicator-wrapper {
  display: inline-block;
  overflow: hidden;
  vertical-align: text-bottom;
  height: 18px;
  width: 18px;
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
    line-height: 18px;

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
