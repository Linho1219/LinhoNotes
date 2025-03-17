<template>
  <div class="baselineStatus custom-block" :class="status">
    <div class="featureName">Baseline Status: {{ props.feature }}</div>
    <hr />
    <details class="baselineCard">
      <summary class="baselineSummary">
        <div class="baselineTitle">
          <BaselineIcon :status="status" />
          <span class="baselineTitleText">
            Baseline
            <span class="baselineTitleInfo">2023</span>
          </span>
          <span v-if="status === 'newly'" class="newlyPill"
            >Newly available</span
          >
        </div>
        <div class="browsers" v-if="status !== 'unknown'">
          <span class="engine">
            <span class="browser chrome checked"></span>
            <span class="browser edge checked"></span>
          </span>
          <span class="engine">
            <span class="browser firefox checked"></span>
          </span>
          <span class="engine">
            <span class="browser safari cross"></span>
          </span>
        </div>
      </summary>
      <div class="extra">
        <p>
          Since July 2023, this feature works across the latest devices and
          browser versions. This feature might not work in older devices or
          browsers.
        </p>
      </div>
    </details>
  </div>
</template>
<script setup lang="ts">
import "baseline-status";
import { ref } from "vue";
import BaselineIcon from "./baselineIcon.vue";
const props = defineProps<{ feature: string }>();
const status = ref<"widely" | "newly" | "limited" | "unknown">("widely");
</script>

<style>
.baselineStatus {
  background-color: var(--baseline-soft);
  padding: 0 1.2rem;
  color: var(--vp-c-text);
}
.baselineSummary::before {
  color: var(--baseline-color);
}
.baselineStatus .featureName {
  font-size: 1.1em;
  font-weight: bold;
  margin: 16px 0;

}
.baselineCard {
  margin: 16px 0 !important;
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
  padding: 0.25em 0.4em;
  border-radius: 2px;
  font-size: 0.7em;
  line-height: 1;
  text-transform: uppercase;
  margin-left: 0.5em;
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
</style>

<style>
.baselineStatus {
  --limited-f: light-dark(#f09409, #f09409);
  --limited-b: light-dark(#c6c6c6, #565656);
  --widely-f: light-dark(#1ea446, #1ea446);
  --widely-b: light-dark(#c4eed0, #125225);
  --newly-f: light-dark(#1b6ef3, #4185ff);
  --newly-b: light-dark(#a8c7fa, #2d509e);
  --unknown: light-dark(#909090, #666666);
}
.baselineStatus.newly {
  --baseline-color: #4185ff;
  --baseline-accent: #3367d6;
  --baseline-soft: rgba(0, 110, 255, 0.16);
}
.baselineStatus.widely {
  --baseline-color: var(--ln-c-green);
  --baseline-accent: #1e8e3e;
  --baseline-soft: var(--ln-c-green-soft);
}
.baselineStatus.limited {
  --baseline-color: var(--ln-c-yellow);
  --baseline-accent: #ea8600;
  --baseline-soft: var(--ln-c-yellow-soft);
}
.baselineStatus.unknown {
  --baseline-color: var(--ln-c-gray);
  --baseline-accent: #3367d6;
  --baseline-soft: var(--ln-c-gray-soft);
}
</style>
