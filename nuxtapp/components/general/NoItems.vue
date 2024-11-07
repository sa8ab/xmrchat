<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    icon?: string;
    text?: string;
  }>(),
  {
    icon: "i-heroicons-moon",
    text: "No Items",
  }
);
</script>

<template>
  <div class="flex text-pale flex-col items-center gap-4 px-2 py-8">
    <UIcon :name="icon" class="text-3xl"></UIcon>
    <span>{{ text }}</span>
  </div>
</template>

<style scoped></style>
