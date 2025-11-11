<script lang="ts" setup>
const props = defineProps<{
  text?: string;
}>();
</script>

<template>
  <div
    class="obs-message-head bg-primary font-medium px-2 py-1 rounded-md text-white absolute top-0 left-2 translate-y-[-50%] ring-1 ring-border"
  >
    {{ text }}
  </div>
</template>

<style scoped></style>
