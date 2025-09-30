<script setup lang="ts"></script>

<template>
  <span class="status-dot" aria-hidden="true">
    <span class="ripple"></span>
    <!-- <span class="ripple ripple--delay"></span> -->
    <span class="glow" aria-hidden="true"></span>
  </span>
</template>

<style scoped>
.status-dot {
  @apply w-2 h-2 rounded-full inline-flex items-center justify-center bg-primary transform-gpu;
}

.glow {
  @apply absolute w-full h-full rounded-full bg-primary opacity-10 pointer-events-none -z-10;
  animation: innerPulse 2000ms ease-in-out infinite;
}

.ripple {
  @apply w-full h-full rounded-full bg-primary opacity-10 pointer-events-none -z-10;
  animation: ripple 2000ms cubic-bezier(0.22, 0.75, 0.36, 0.8) infinite;
}

.ripple--delay {
  animation-delay: 1000ms; /* half-cycle */
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  70% {
    transform: scale(2);
    opacity: 0.25;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

@keyframes innerPulse {
  0% {
    transform: scale(1);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.6);
    opacity: 0.08;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
