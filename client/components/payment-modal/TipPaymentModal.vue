<script lang="ts" setup>
import type { TipCreationResponse } from "~/types";

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

const { init, disconnect } = usePaymentSocket({
  onMessage: (data) => {
    console.log(data);

    if (!data.data.tip?.paid) return;

    toast.add({
      title: "Tip received successfully!",
    });
    emit("paid");
  },

  onError: () => {
    cancelPayment();
    toast.add({
      color: "red",
      title: "Something went wrong checking for payment",
      description:
        "If you have already sent the payment it will be credited as soon as received.",
      timeout: 0,
    });
  },

  onClose: () => {
    paymentError.value = true;
  },
});

const cancelPayment = () => {
  disconnect();
  emit("cancel");
};

const initSocket = () => {
  paymentError.value = false;
  init({
    slug: `tip-${props.createdTip?.id as string}`,
  });
};

const retry = () => {
  initSocket();
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
        address: createdTip?.payment_address,
        amount: createdTip?.amount,
      }"
      :error="paymentError"
      @cancel="cancelPayment"
      @retry="retry"
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
