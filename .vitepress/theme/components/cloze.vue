<template>
  <span class="cloze"><slot></slot></span>
</template>
<style>
.cloze {
  color: transparent;
  background: #8886;
  box-shadow: 0 0 0 0 transparent;
  border-radius: 3px;
  transition:
    color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
}
.cloze:hover {
  color: inherit;
  background: #8883;
  box-shadow: 0 0 0 3px #8886;
}
</style>
