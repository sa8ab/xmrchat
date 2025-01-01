<script lang="ts" setup>
import QrcodeVue from "qrcode.vue";
import type { Numberic } from "~/types";

export interface PaymentQRCodeProps {
  address?: string;
  amount?: Numberic;
  description?: string;
  ticker: string;
}

const props = defineProps<PaymentQRCodeProps>();

const renderValue = computed(() => {
  return generateWalletLink({
    ticker: props.ticker,
    address: props.address,
    amount: props.amount,
    description: props.description,
  });
});
</script>

<template>
  <div v-if="address" class="flex flex-col gap-2 items-center pt-2">
    <UButton
      :to="renderValue"
      target="_blank"
      icon="i-heroicons-arrow-top-right-on-square-20-solid"
      trailing
    >
      Open In My Wallet
    </UButton>
    <QrcodeVue
      :margin="4"
      :value="renderValue"
      :size="256"
      level="M"
      class="rounded-lg"
    >
    </QrcodeVue>
  </div>
</template>

<style scoped></style>
