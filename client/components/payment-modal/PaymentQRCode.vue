<script lang="ts" setup>
import QrcodeVue from "qrcode.vue";
import type { Numberic } from "~/types";

export interface PaymentQRCodeProps {
  address?: string;
  amount?: Numberic;
  description?: string;
}

const props = defineProps<PaymentQRCodeProps>();

const renderValue = computed(() => {
  if (!props.address || !props.amount) return undefined;
  return `monero:${props.address}?tx_amount=${props.amount}&tx_description=${
    props.description || ""
  }`;
});
</script>

<template>
  <div v-if="address" class="flex flex-col gap-3 items-center pb-4">
    <span>OR</span>
    <QrcodeVue
      :margin="4"
      :value="renderValue"
      :size="256"
      level="M"
      class="rounded-lg"
    >
    </QrcodeVue>
    <UButton block :to="renderValue" target="_blank">Open In My Wallet</UButton>
  </div>
</template>

<style scoped></style>
