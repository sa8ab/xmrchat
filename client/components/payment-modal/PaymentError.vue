<script lang="ts" setup>
const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <span class="flex gap-1 items-center">
      <UIcon
        class="w-[24px] h-[24px] text-red-500"
        name="i-heroicons-exclamation-circle"
      />
      Payment checking is disconnected.
    </span>
    <span class="text-sm text-pale">
      If payment is already made it will be displayed on tips list.
    </span>
    <UButton
      @click="emit('retry')"
      variant="ghost"
      icon="i-heroicons-arrow-path"
    >
      Reconnect
    </UButton>
  </div>
</template>

<style scoped></style>
