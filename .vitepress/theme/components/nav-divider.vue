<template>
  <div class="nav-divider"></div>
</template>
<style lang="scss">
.nav-divider {
  height: 100%;
  display: grid;
  place-items: center;
  &::after {
    content: '';
    margin: auto 8px;
    display: block;
    width: 1px;
    height: 24px;
    background-color: var(--vp-c-divider);
  }
}
@media only screen and (max-width: 768px) {
  .nav-divider {
    display: none;
  }
}
</style>
