<script lang="ts" setup>
import type { BasePaymentData, TipCreationResponse } from "~/types";
import { SwapStatusEnum } from "~/types/enums";
import VueCountdown from "@chenfengyuan/vue-countdown";

const props = defineProps<{
  data?: BasePaymentData;
  connectionStatus?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  retry: [];
}>();

const { expired, remaining, initialize } = usePaymentExpiration();

const renderStatusClassName = computed(() => {
  return `text-${
    SWAP_STATUSES[props.data?.swap?.status as SwapStatusEnum]?.color
  }-500`;
});

const showCountdown = computed(
  () => props.data?.swap?.status === SwapStatusEnum.WAITING
);

const renderStatusMessage = computed(() => {
  const status = props.data?.swap?.status;

  if (status === SwapStatusEnum.WAITING) return "Waiting for payment.";
  if (status === SwapStatusEnum.CONFIRMING)
    return "Waiting for blockchain confirmation.";
  if (status === SwapStatusEnum.SENDING)
    return "Swap is being sent to XMRChat.";
  if (status === SwapStatusEnum.FAILED)
    return "Swap failed, please contact Trocador support.";

  return undefined;
});

const showLoading = computed(() =>
  [
    SwapStatusEnum.WAITING,
    SwapStatusEnum.CONFIRMING,
    SwapStatusEnum.SENDING,
  ].includes(props.data?.swap?.status!)
);

const showAddress = computed(() => {
  const status = props.data?.swap?.status!;

  return [
    SwapStatusEnum.WAITING,
    SwapStatusEnum.CONFIRMING,
    SwapStatusEnum.SENDING,
    SwapStatusEnum.FAILED,
  ].includes(status);
});

const showFailedMessage = computed(() => {
  return props.data?.swap?.status === SwapStatusEnum.FAILED;
});

const renderMessage = computed(() => {
  const status = props.data?.swap?.status!;

  if (status === SwapStatusEnum.WAITING) return "DEFAULT";
  if (
    [
      SwapStatusEnum.CONFIRMING,
      SwapStatusEnum.SENDING,
      SwapStatusEnum.FINISHED,
    ].includes(status)
  )
    return "Payment received.";

  return undefined;
});

const renderCancelText = computed(() => {
  const status = props.data?.swap?.status!;
  if (status !== SwapStatusEnum.WAITING) return "Close";
  return "Cancel";
});

const showETA = computed(() => {
  const status = props.data?.swap?.status!;
  return [SwapStatusEnum.WAITING, SwapStatusEnum.CONFIRMING].includes(status);
});

// Using watch cause we are not sure if when component mounts the props are passed to it.
watch(
  () => props.data?.expiresAt,
  (v) => {
    if (v) initialize(v);
  },
  { immediate: true }
);
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <UAlert color="red" variant="subtle" v-if="showFailedMessage" class="mt-2">
      <template #description>
        <p class="text-base">
          Swap failed. Please visit the Trocador link below to check the status
          and cancel the swap if necessary.
        </p>
      </template>
    </UAlert>

    <p class="text-red-500 text-center" v-else-if="expired">
      Payment is expired. If you have already sent your payment please contact
      support.
    </p>

    <template v-else>
      <template v-if="showAddress">
        <UAlert color="emerald" variant="subtle" v-if="renderMessage">
          <template #description>
            <p class="text-base" v-if="renderMessage === 'DEFAULT'">
              Please send
              <span class="font-bold">exactly </span>
              <span class="font-bold"
                >{{ data?.swap?.inputAmount }}
                {{ data?.swap?.coin?.name }}</span
              >
              to this address for your xmrchat to be displayed.
            </p>
            <p class="text-base" v-else>
              {{ renderMessage }}
            </p>
          </template>
        </UAlert>

        <PaymentQRCode
          :address="data?.swap?.swapAddress"
          :amount="data?.swap?.inputAmount"
          :ticker="data?.swap?.coin.ticker!"
        />

        <UDivider label="OR" class="mb-3" />

        <PaymentAddressDisplay
          :address="data?.swap?.swapAddress"
          class="mb-4"
        />
      </template>

      <PaymentError
        v-if="connectionStatus === 'DISCONNECTED'"
        @retry="emit('retry')"
      />
      <PaymentLoading
        v-else-if="renderStatusMessage"
        :text="renderStatusMessage"
        :showLoading="showLoading"
      />

      <VueCountdown
        v-if="remaining && showCountdown"
        :time="remaining"
        @end="expired = true"
      >
        <template #default="{ minutes, seconds }">
          <p class="text-center">
            {{ minutes.toString().padStart(2, "0") }}:{{
              seconds.toString().padStart(2, "0")
            }}
          </p>
        </template>
      </VueCountdown>
    </template>

    <div class="p-2 rounded-lg border border-border mt-2">
      <div v-if="data?.swap" class="text-center text-sm">
        <span>Swap Status: </span>
        <span :class="[renderStatusClassName]">{{
          SWAP_STATUSES[data.swap.status as SwapStatusEnum]?.label
        }}</span>
      </div>

      <p
        class="text-pale text-xs text-center mt-1"
        v-if="showETA && data?.swap?.eta"
      >
        Swap ETA is about {{ data?.swap?.eta }} minutes.
      </p>
      <div class="text-pale text-xs text-center mt-1">
        You can track your swap directly from
        <ULink
          target="_blank"
          class="text-primary"
          :to="`https://trocador.app/en/checkout/${data?.swap?.swapId}`"
        >
          Trocador </ULink
        >.
      </div>
    </div>
  </div>
</template>

<style scoped></style>
