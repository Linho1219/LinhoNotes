<template>
  <div class="cadpa-container">
    <div class="cadpa-inner" :class="'a' + props.age">
      <span class="cadpa-age"
        >{{ props.age }}<span class="cadpa-plus">+</span></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  age: Number,
});
</script>

<style>
.cadpa-container {
  display: inline-block;
  width: 75px;
  height: 100px;
  position: relative;
  text-align: center;
  background: white;
  border: #000c 2px solid;
  border-radius: 5px;
	vertical-align: middle;
}

.cadpa-inner {
  width: 60px;
  height: 70px;
  margin: 6px auto;
  position: relative;
  border-radius: 4px;
  color: white;
}

.a8.cadpa-inner {
  background: #67c13d;
}

.a12.cadpa-inner {
  background: #1497db;
}
.a16.cadpa-inner {
  background: #f7ae3d;
}

.a18.cadpa-inner {
  background: #fe0000;
}

.cadpa-inner::after {
  content: "CADPA";
  display: inline-block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0px;
  font-size: 13px;
  line-height: 18px;
  font-family: sans-serif;
}

.cadpa-age {
  display: inline-block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  line-height: 60px;
  font-weight: bold;
  font-size: 34px;
  font-family: Arial;
  vertical-align: middle;
}

.a8 .cadpa-age {
  font-size: 38px;
}

.cadpa-plus {
  display: inline-block;
  font-size: 20px;
  line-height: 1em;
  vertical-align: middle;
  margin-bottom: 0.25em;
}

.a8 .cadpa-plus {
  font-size: 28px;
}

.cadpa-container::after {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
  line-height: 20px;
  content: "适龄提示";
  color: black;
  font-weight: 500;
}
</style>
