<script lang="ts" setup>
import type { TipCreationResponse, TipEventData } from "~/types";

const props = defineProps<{
  createdTip?: TipCreationResponse;
  slug?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  paid: [];
}>();

const active = defineModel<boolean>("active");
const paymentError = ref(false);

const authStore = useAuthStore();

const showWalletWarning = computed(
  () => authStore.state.page?.path === props.slug
);

const toast = useToast();

const { init, disconnect, reconnect, connectionStatus } =
  usePaymentSocket<TipEventData>({
    onTipEvent: (data) => {
      console.log(data);

      if (!data.paidAt) return;

      toast.add({
        title: "Tip received successfully!",
      });
      disconnect();
      emit("paid");
    },

    onSwapStatusChangeEvent: (swap) => {
      console.log(swap);
      if (props.createdTip?.swap) {
        props.createdTip.swap.status = swap.status;
        props.createdTip.swap.statusMessage = swap.statusMessage;
      }
    },
  });

const handleRetry = () => {
  reconnect();
};

const cancelPayment = () => {
  disconnect();
  emit("cancel");
};

const initSocket = () => {
  paymentError.value = false;
  init({
    path: "tips",
    query: { tipId: props.createdTip?.id },
  });
};

watch(active, (currentActive) => {
  if (currentActive) {
    initSocket();
  } else {
    disconnect();
  }
});

onBeforeUnmount(() => disconnect());
</script>

<template>
  <UModal v-model="active" preventClose>
    <TipSwapPaymentContent
      v-if="createdTip?.swap"
      @retry="handleRetry"
      @cancel="cancelPayment"
      :createdTip="createdTip"
      :connectionStatus="connectionStatus"
    >
    </TipSwapPaymentContent>
    <PaymentModalContent
      v-else
      title="Send Tip"
      :qrCode="{
        address: createdTip?.paymentAddress,
        amount: createdTip?.amount,
        ticker: 'xmr',
      }"
      :connectionStatus="connectionStatus"
      @cancel="cancelPayment"
      @retry="handleRetry"
    >
      <UAlert
        v-if="showWalletWarning"
        color="orange"
        variant="subtle"
        class="mb-2"
      >
        <template #title>
          <span>Do not tip with streamer wallet.</span>
        </template>
        <template #description>
          Please avoid sending tips with wallet registered on the page. The
          change returned inflates the amount we see received.
        </template>
        <template #icon>
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-[24px] h-[24px]"
          />
        </template>
      </UAlert>
      <template v-if="createdTip">
        <UAlert color="emerald" variant="subtle" class="text-xl">
          <template #title>
            <span>NOTE</span>
          </template>
          <template #description>
            <p class="text-[15px] leading-6">
              Please send minimum
              <span class="font-bold">{{ createdTip.amount }} XMR</span>
              to the following address
            </p>
          </template>
        </UAlert>
      </template>
    </PaymentModalContent>
  </UModal>
</template>

<style scoped></style>
