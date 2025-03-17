<template>
  <div class="baselineStatus custom-block" :class="status">
    <div class="featureName">
      Baseline status of <code>{{ featureNameStr }}</code>
    </div>
    <hr />
    <details class="baselineCard">
      <summary class="baselineSummary">
        <div class="baselineTitle">
          <BaselineIcon :status="status" />
          <span class="baselineTitleText">
            <span v-if="status === 'newly' || status === 'widely'"
              >Baseline&nbsp;</span
            >
            <span class="baselineTitleInfo">{{ baselineInfoStr }}</span>
          </span>
          <span v-if="status === 'newly'" class="newlyPill">
            Newly available
          </span>
        </div>
        <div class="browsers" v-if="status !== 'unknown'">
          <span class="engine">
            <span class="browser chrome" :class="brwsrCompat.chrome"></span>
            <span class="browser edge" :class="brwsrCompat.edge"></span>
          </span>
          <span class="engine">
            <span class="browser firefox" :class="brwsrCompat.firefox"></span>
          </span>
          <span class="engine">
            <span class="browser safari" :class="brwsrCompat.safari"></span>
          </span>
        </div>
      </summary>
      <div class="extra">
        <p v-if="status === 'widely'">
          This feature is well established and works across many devices and
          browser versions. It’s been available across browsers since
          <strong>{{ lowDateStr }}</strong
          >.
        </p>
        <p v-if="status === 'newly'">
          Since <strong>{{ lowDateStr }}</strong
          >, this feature works across the latest devices and browser versions.
          This feature might not work in older devices or browsers.
        </p>
        <p v-if="status === 'limited'">
          This feature is not Baseline because it does not work in some of the
          most widely-used browsers.
        </p>
        <p v-if="status === 'unknown'">
          Could not fetch information about this feature. Try searcing on <a class="animated-link" href="https://caniuse.com/" target="_blank">Can I Use</a> or
          <a class="animated-link" href="https://caniuse.com/" target="_blank">MDN Web Docs</a> for more information.
        </p>
        <p class="links">
          <a
            class="vp-external-link-icon animated-link"
            target="_blank"
            href="https://developer.mozilla.org/zh-CN/docs/Glossary/Baseline/Compatibility"
            >Learn More</a
          >　
          <a
            class="vp-external-link-icon animated-link"
            target="_blank"
            :href="'https://webstatus.dev/features/' + props.feature"
            >See full compatibility</a
          >
        </p>
      </div>
    </details>
  </div>
</template>
<script setup lang="ts">
// import "baseline-status";
import { onMounted, reactive, ref } from "vue";
import BaselineIcon from "./baselineIcon.vue";
import axios from "axios";
const props = defineProps<{ feature: string }>();
const status = ref<"widely" | "newly" | "limited" | "unknown">("unknown");
const featureNameStr = ref(props.feature);
const baselineInfoStr = ref("Unknown availability");
const lowDateStr = ref("");
const toCheckCross = (status: any) => (status ? "checked" : "cross");
const brwsrCompat = reactive<{
  chrome: "checked" | "cross";
  edge: "checked" | "cross";
  firefox: "checked" | "cross";
  safari: "checked" | "cross";
}>({
  chrome: "cross",
  edge: "cross",
  firefox: "cross",
  safari: "cross",
});
interface APIreturn {
  baseline: {
    low_date?: string;
    status: "widely" | "newly" | "limited";
  };
  browser_implementations: {
    chrome?: {
      date: string;
      version: string;
      status: "available";
    };
    edge?: {
      date: string;
      version: string;
      status: "available";
    };
    firefox?: {
      date: string;
      version: string;
      status: "available";
    };
    safari?: {
      date: string;
      version: string;
      status: "available";
    };
  };
  feature_id: string;
  name: string;
}
const API_URL = "https://api.webstatus.dev/v1/features/";
onMounted(() => {
  axios
    .get(API_URL + props.feature)
    .then((response) => {
      const data: APIreturn = response.data;
      status.value = data.baseline.status;
      featureNameStr.value = data.name;
      [
        brwsrCompat.chrome,
        brwsrCompat.edge,
        brwsrCompat.firefox,
        brwsrCompat.safari,
      ] = [
        data.browser_implementations.chrome,
        data.browser_implementations.edge,
        data.browser_implementations.firefox,
        data.browser_implementations.safari,
      ].map(toCheckCross);
      switch (data.baseline.status) {
        case "widely": {
          const lowDate = new Date(data.baseline.low_date!);
          baselineInfoStr.value = "widely available";
          lowDateStr.value = lowDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          });
          break;
        }
        case "newly": {
          const lowDate = new Date(data.baseline.low_date!);
          baselineInfoStr.value = lowDate.getFullYear().toString();
          lowDateStr.value = lowDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          });
          break;
        }
        case "limited":
          baselineInfoStr.value = "Limited availability";
          break;
      }
    })
    .catch((err) => {
      console.error("Baseline info not found: ", props.feature);
    });
});
</script>

<style>
.baselineStatus {
  background-color: var(--baseline-soft);
  padding: 0 1.2rem;
  color: var(--vp-c-text);
  font-size: 1rem;
}
.baselineSummary::before {
  color: var(--baseline-color);
}
.baselineStatus .featureName {
  margin: 10px 0 -2px 0;
}
.baselineStatus .featureName + hr {
  margin: 10px -1.2rem;
}
.baselineStatus .featureName code {
  padding: 0;
  background: none;
  color: inherit;
  font-weight: bold;
  font-size: 1em;
}
.baselineCard {
  margin: 14px 0 !important;
}
.baselineCard p {
  margin: 10px 0 !important;
}
.baselineSummary {
  margin: 8px 0 0 0 !important;
  padding-left: 46px;
  padding-right: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 1.1em;
  cursor: pointer;
}
.baselineSummary::before {
  right: 0;
  left: unset;
  transform: rotate(90deg);
}
.baselineCard[open] .baselineSummary::before {
  transform: rotate(-90deg);
}
.baselineIcon {
  margin-left: -46px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.baselineTitle {
  display: flex;
  font-weight: bold;
  align-items: center;
  margin-right: 15px;
}
.baselineTitleInfo {
  font-weight: normal;
}
.newlyPill {
  background-color: var(--baseline-accent);
  color: white;
  padding: 0.75em 0.4em;
  border-radius: 2px;
  font-size: 0.7em;
  line-height: 0;
  text-transform: uppercase;
  margin-left: 0.6em;
  white-space: nowrap;
}

.baselineCard .browsers {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.4em;
}

.baselineCard .engine {
  background: var(--vp-c-bg);
  padding: 0.5em 0.625em;
  border-radius: 2em;
  font-size: 20px;
  display: flex;
  gap: 0.4em;
}

.baselineCard .browser {
  width: 1.8em;
  height: 1em;
  display: inline-block;
  position: relative;
}

.baselineCard .browser::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1em;
  height: 1em;
  background-size: contain;
  background-repeat: no-repeat;
}
.baselineCard .browser.chrome::before {
  background-image: url(./assets/chrome.svg);
}
.baselineCard .browser.edge::before {
  background-image: url(./assets/edge.svg);
}
.baselineCard .browser.firefox::before {
  background-image: url(./assets/firefox.svg);
}
.baselineCard .browser.safari::before {
  background-image: url(./assets/safari.svg);
}
.baselineCard .browser::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 0.8em;
  height: 1em;
}

.baselineCard .browser.checked::after {
  background: var(--widely-f);
  mask: url(./assets/check.svg) no-repeat;
  -webkit-mask: url(./assets/check.svg) no-repeat;
}
.newly .baselineCard .browser.checked::after {
  background: var(--newly-f);
}
.baselineCard .browser.cross::after {
  background: var(--limited-f);
  mask: url(./assets/cross.svg) no-repeat;
  -webkit-mask: url(./assets/cross.svg) no-repeat;
}
.baselineCard .links {
  padding-bottom: 2px;
}
.baselineCard a {
  --link-color: var(--baseline-color);
  --link-soft: var(--baseline-soft);
  color: var(--baseline-color);
}
</style>

<style>
.baselineStatus {
  --limited-f: #f09409;
  --limited-b: #c6c6c6;
  --widely-f: #1ea446;
  --widely-b: #c4eed0;
  --newly-f: #1b6ef3;
  --newly-b: #a8c7fa;
  --unknown: #909090;
}
.dark .baselineStatus {
  --limited-f: #f09409;
  --limited-b: #565656;
  --widely-f: #1ea446;
  --widely-b: #125225;
  --newly-f: #4185ff;
  --newly-b: #2d509e;
  --unknown: #666666;
}
.baselineStatus.newly {
  --baseline-color: var(--ln-c-blue);
  --baseline-accent: #3367d6;
  --baseline-soft: #1178ff22;
}
.baselineStatus.widely {
  --baseline-color: var(--ln-c-green);
  --baseline-accent: #1e8e3e;
  --baseline-soft: #00c60a1c;
}
.baselineStatus.limited {
  --baseline-color: var(--ln-c-yellow);
  --baseline-accent: #ea8600;
  --baseline-soft: #f094091e;
}
.baselineStatus.unknown {
  --baseline-color: var(--ln-c-gray);
  --baseline-accent: var(--ln-c-gray);
  --baseline-soft: var(--ln-c-gray-soft);
}
</style>
