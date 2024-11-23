<script lang="ts" setup>
import type {
  PaymentSocketMessage,
  TipCreationResponse,
  TipEventData,
} from "~/types";

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
    <PaymentModalContent
      title="Send Tip"
      :qrCode="{
        address: createdTip?.paymentAddress,
        amount: createdTip?.amount,
      }"
      :connectionStatus="connectionStatus"
      @cancel="cancelPayment"
      @retry="handleRetry"
    >
      <template v-if="createdTip">
        <UAlert color="emerald" variant="subtle" class="text-xl">
          <template #title>
            <h6 class="font-bold text-base">NOTE</h6>
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
