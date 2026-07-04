<template>
  <Teleport to="body">
    <div class="search-overlay" />
  </Teleport>
</template>

<style lang="scss">
.DocSearch-Container {
  backdrop-filter: none !important;
  background: none !important;
}
.DocSearch-Modal {
  box-shadow:
    color-mix(in srgb, var(--vp-c-brand) 50%, transparent) 0 0 0 2px,
    light-dark(#0003, #0008) 0 20px 50px !important;
}

.search-overlay {
  --opacity: 0.6;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--vp-c-bg);
  opacity: var(--opacity);
  z-index: 399;
  transition: opacity 0.2s;

  @media screen and (max-width: 760px) {
    display: none;
  }
  @supports not selector(body:has(.DocSearch-Container)) {
    display: none;
  }
  opacity: 0;
  pointer-events: none;
  body:has(.DocSearch-Container) & {
    opacity: var(--opacity);
    pointer-events: auto;
  }
}
</style>
