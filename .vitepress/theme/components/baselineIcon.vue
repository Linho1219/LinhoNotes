<template>
  <svg
    v-if="props.status === 'widely'"
    class="baselineIcon"
    viewBox="0 0 36 20"
  >
    <path fill="var(--widely-f)" d="M18 8L20 10L18 12L16 10L18 8Z" />
    <path fill="var(--widely-f)" d="M26 0L28 2L10 20L0 10L2 8L10 16L26 0Z" />
    <path
      fill="var(--widely-b)"
      d="M28 2L26 4L32 10L26 16L22 12L20 14L26 20L36 10L28 2Z"
    />
    <path fill="var(--widely-b)" d="M10 0L2 8L4 10L10 4L14 8L16 6L10 0Z" />
  </svg>
  <svg
    v-if="props.status === 'limited'"
    class="baselineIcon"
    viewBox="0 0 36 20"
  >
    <path fill="var(--limited-f)" d="M10 0L16 6L14 8L8 2L10 0Z" />
    <path fill="var(--limited-f)" d="M22 12L20 14L26 20L28 18L22 12Z" />
    <path fill="var(--limited-f)" d="M26 0L28 2L10 20L8 18L26 0Z" />
    <path fill="var(--limited-b)" d="M8 2L10 4L4 10L10 16L8 18L0 10L8 2Z" />
    <path
      fill="var(--limited-b)"
      d="M28 2L36 10L28 18L26 16L32 10L26 4L28 2Z"
    />
  </svg>
  <svg v-if="props.status === 'newly'" class="baselineIcon" viewBox="0 0 36 20">
    <path
      fill="var(--newly-b)"
      d="m10 0 2 2-2 2-2-2 2-2Zm4 4 2 2-2 2-2-2 2-2Zm16 0 2 2-2 2-2-2 2-2Zm4 4 2 2-2 2-2-2 2-2Zm-4 4 2 2-2 2-2-2 2-2Zm-4 4 2 2-2 2-2-2 2-2Zm-4-4 2 2-2 2-2-2 2-2ZM6 4l2 2-2 2-2-2 2-2Z"
    />
    <path fill="var(--newly-f)" d="m26 0 2 2-18 18L0 10l2-2 8 8L26 0Z" />
  </svg>
  <svg
    v-if="props.status === 'unknown'"
    class="baselineIcon"
    viewBox="0 0 36 20"
  >
    <path fill="var(--unknown)" d="M18 8L20 10L18 12L16 10L18 8Z" />
    <path
      fill="var(--unknown)"
      d="M28 2L26 4L32 10L26 16L22 12L20 14L26 20L36 10L28 2Z"
    />
    <path fill="var(--unknown)" d="M10 0L2 8L4 10L10 4L14 8L16 6L10 0Z" />
    <path fill="var(--unknown)" d="M26 0L28 2L10 20L0 10L2 8L10 16L26 0Z" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: "widely" | "newly" | "limited" | "unknown";
}>();
</script>

<style>
.baselineIcon {
  --limited-f: light-dark(#f09409, #f09409);
  --limited-b: light-dark(#c6c6c6, #565656);
  --widely-f: light-dark(#1ea446, #1ea446);
  --widely-b: light-dark(#c4eed0, #125225);
  --newly-f: light-dark(#1b6ef3, #4185ff);
  --newly-b: light-dark(#a8c7fa, #2d509e);
  --unknown: light-dark(#909090, #666666);
  width: 36px;
  height: 20px;
}
</style>
