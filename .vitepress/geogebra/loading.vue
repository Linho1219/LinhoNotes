<template>
  <div class="circle-loading">
    <svg class="circle-loading-svg" viewBox="0 0 48 48" style="">
      <circle
        class="circle-loading-circle"
        transform="rotate(-90, 24, 24)"
        cx="24"
        cy="24"
        r=" 22"
      ></circle>
    </svg>
  </div>
</template>

<style>
.circle-loading {
  width: 48px;
  height: 48px;
  border-radius: inherit;
  position: relative;
  color: var(--vp-c-brand);
  animation: rotate 1568ms linear infinite;
  --dasharray: 138.23007675795088px;
}
.circle-loading-svg {
  height: inherit;
  width: inherit;
  stroke: currentColor;
  animation: stroke-rotate 5.2s ease-in-out infinite;
}
.circle-loading-circle {
  stroke-linecap: round;
  fill: none;
  stroke-dasharray: var(--dasharray);
  animation: stroke 1.3s ease-in-out infinite;
  stroke-width: 4px;
}

@keyframes stroke {
  0% {
    stroke-dashoffset: var(--dasharray);
  }
  50% {
    stroke-dashoffset: calc(var(--dasharray) / 4);
  }
  100% {
    stroke-dashoffset: var(--dasharray);
  }
}
@keyframes stroke-rotate {
  0% {
    transform: rotate(0deg);
  }
  12.5% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(270deg);
  }
  37.5% {
    transform: rotate(270deg);
  }
  50% {
    transform: rotate(540deg);
  }
  62.5% {
    transform: rotate(540deg);
  }
  75% {
    transform: rotate(810deg);
  }
  87.5% {
    transform: rotate(810deg);
  }
  100% {
    transform: rotate(1080deg);
  }
  100% {
    transform: rotate(1080deg);
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
