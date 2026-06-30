<template>
  <span class="cloze" tabindex="0"><slot></slot></span>
</template>
<style>
.cloze {
  --cloze-transition-duration: 0.15s;
  background: #888;
  border-radius: 2px;
  transition:
    filter var(--cloze-transition-duration),
    background-color var(--cloze-transition-duration),
    opacity var(--cloze-transition-duration);
  filter: contrast(0);
  opacity: 0.4;
  padding: 2px 0;
}
.cloze:hover,
.cloze:focus-visible {
  filter: contrast(1);
  opacity: 1;
  background: #8882;
}
</style>
