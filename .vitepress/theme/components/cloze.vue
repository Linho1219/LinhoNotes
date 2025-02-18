<template>
  <span class="cloze"><slot></slot></span>
</template>
<style>
.cloze {
  --cloze-transition: 0.15s;
  background: #888;
  border-radius: 2px;
  transition:
    filter var(--cloze-transition),
    background-color var(--cloze-transition),
    opacity var(--cloze-transition);
  filter: contrast(0);
  opacity: 0.4;
  padding: 2px 0;
}
.cloze:hover {
  filter: contrast(1);
  opacity: 1;
  background: #8882;
}
</style>
