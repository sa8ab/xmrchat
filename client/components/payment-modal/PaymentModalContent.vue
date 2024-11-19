<script lang="ts" setup>
import type { PaymentQRCodeProps } from "./PaymentQRCode.vue";

interface Props {
  title?: string;
  qrCode?: PaymentQRCodeProps;
  error?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cancel: [];
  retry: [];
}>();
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-bold text-base">{{ title }}</h2>
    </template>
    <slot />
    <div class="w-full flex flex-col items-center gap-4 pt-4">
      <PaymentAddressDisplay :address="qrCode?.address" />
      <PaymentQRCode v-bind="qrCode" />
      <PaymentError v-if="error" @retry="emit('retry')" />
      <PaymentLoading v-else />
    </div>
    <div class="flex justify-end pt-3">
      <UButton variant="outline" @click="emit('cancel')">Cancel</UButton>
    </div>
  </UCard>
</template>

<style scoped lang="scss">
.qr-code {
  @apply w-[300px] h-[300px] bg-gray-800;
}
</style>
