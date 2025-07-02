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
      {{ $t("paymentCheckingDis") }}
    </span>
    <span class="text-sm text-pale">
      {{ $t("ifPaymentMade") }}
    </span>
    <UButton
      @click="emit('retry')"
      variant="ghost"
      icon="i-heroicons-arrow-path"
    >
      {{ $t("reconnect") }}
    </UButton>
  </div>
</template>

<style scoped></style>
