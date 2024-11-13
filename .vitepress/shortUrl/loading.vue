<template>
  <div id="loader">
    <div id="shadow"></div>
    <div id="box"></div>
  </div>
</template>
<style>
#loader {
  position: fixed;
  top: calc(50vh - 20px);
  left: calc(50vw - 20px);
}
#box {
  width: 50px;
  height: 50px;
  background: #eeee;
  animation: animate 0.5s linear infinite;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
}
@keyframes animate {
  17% {
    border-bottom-right-radius: 3px;
  }
  25% {
    transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 40px;
  }
  75% {
    transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    transform: translateY(0) rotate(90deg);
  }
}
#shadow {
  width: 50px;
  height: 5px;
  background: #8885;
  position: absolute;
  top: 59px;
  left: 0;
  border-radius: 50%;
  animation: shadow 0.5s linear infinite;
}
@keyframes shadow {
  50% {
    transform: scale(1.2, 1);
  }
}
</style>
