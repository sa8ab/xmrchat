<script lang="ts" setup>
const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="icon">
      <UIcon
        class="w-[32px] h-[32px] text-red-500"
        name="i-heroicons-exclamation-circle-16-solid"
      />
    </div>
    <span>Payment check failed, click to retry</span>
    <UButton @click="emit('retry')">Retry Payment Checking</UButton>
  </div>
</template>

<style scoped></style>
