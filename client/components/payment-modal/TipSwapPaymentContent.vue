<script lang="ts" setup>
import type { Coin, Numberic, TipCreationResponse } from "~/types";
import type { SwapStatusEnum } from "~/types/enums";

const props = defineProps<{
  createdTip?: TipCreationResponse;
  connectionStatus?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  retry: [];
}>();

const renderStatusClassName = computed(() => {
  return `text-${
    SWAP_STATUSES[props.createdTip?.swap?.status as SwapStatusEnum]?.color
  }-500`;
});
</script>

<template>
  <PaymentModalContent
    title="Send Tip"
    :connectionStatus="connectionStatus"
    @cancel="emit('cancel')"
    @retry="emit('retry')"
    :qrCode="{
      address: createdTip?.swap?.swapAddress,
      amount: createdTip?.swap?.inputAmount,
      ticker: createdTip?.swap?.coin.ticker!
    }"
  >
    <UAlert color="orange" variant="subtle">
      <template #description>
        <p class="text-base">
          Please send exactly
          <span class="font-bold"
            >{{ createdTip?.swap?.inputAmount }}
            {{ createdTip?.swap?.coin?.name }}</span
          >
          to the following address.
        </p>
      </template>
    </UAlert>

    <template #after>
      <div class="p-2 rounded-lg border border-border mt-2">
        <div v-if="createdTip?.swap" class="text-center text-sm">
          <span>Swap Status: </span>
          <span :class="[renderStatusClassName]">{{
            SWAP_STATUSES[createdTip.swap.status as SwapStatusEnum]?.label
          }}</span>
        </div>
        <div class="text-pale text-xs text-center mt-2">
          You can track your swap directly from
          <ULink
            target="_blank"
            class="text-primary"
            :to="`https://trocador.app/en/checkout/${createdTip?.swap?.swapId}`"
          >
            Trocador</ULink
          >.
        </div>
      </div>
    </template>
  </PaymentModalContent>
</template>

<style scoped></style>
