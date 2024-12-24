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
      <template #title>
        <span>NOTE</span>
      </template>
      <template #description>
        <p class="text-[15px] leading-6">
          Send exactly
          <span class="font-bold"
            >{{ createdTip?.swap?.inputAmount }}
            {{ createdTip?.swap?.coin?.name }}</span
          >
          to the following address.
        </p>
      </template>
    </UAlert>

    <template #after>
      <UDivider class="my-3" />
      <div v-if="createdTip?.swap" class="text-center">
        <span>Swap Status: </span>
        <span :class="[renderStatusClassName]">{{
          SWAP_STATUSES[createdTip.swap.status as SwapStatusEnum]?.label
        }}</span>
      </div>
      <div class="text-pale text-sm text-center mt-2">
        You can track your swap status directly from
        <ULink
          target="_blank"
          class="text-primary"
          :to="`https://trocador.app/en/checkout/${createdTip?.swap?.swapId}`"
        >
          Trocador</ULink
        >.
      </div>
    </template>
  </PaymentModalContent>
</template>

<style scoped></style>
