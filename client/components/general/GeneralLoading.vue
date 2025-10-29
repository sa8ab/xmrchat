<script lang="ts" setup></script>

<template>
  <div class="loader"></div>
</template>

<style lang="scss" scoped>
.loader {
  width: 16px;
  height: 16px;
  box-shadow: 0 30px, 0 -30px;
  border-radius: 4px;
  background: currentColor;
  display: block;
  margin: 0 auto 0;
  position: relative;
  color: #ff7f0a;
  transform: translateY(30px) translateX(-28px);
  box-sizing: border-box;
  animation: animloader 2s ease infinite;
}
.loader::after,
.loader::before {
  content: "";
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  box-shadow: 0 30px, 0 -30px;
  border-radius: 4px;
  background: currentColor;
  color: #ff7f0a;
  position: absolute;
  left: 30px;
  top: 0;
  animation: animloader 2s 0.2s ease infinite;
}
.loader::before {
  animation-delay: 0.4s;
  left: 60px;
}

@keyframes animloader {
  0% {
    top: 0;
    color: #ff7f0a;
  }
  50% {
    top: 30px;
    color: rgba(255, 255, 255, 0.2);
  }
  100% {
    top: 0;
    color: #ff7f0a;
  }
}
</style>
