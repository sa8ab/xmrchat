<script lang="ts" setup>
import type { PaymentSocketMessage, SlugReservationResponse } from "~/types";

const props = defineProps<{
  reservedData?: SlugReservationResponse;
  reservedSlug?: string;
}>();

const emit = defineEmits<{
  cancel: [];
}>();

const active = defineModel<boolean>("active");

// const { checkReservation: checkReservationApi } = useServices();
const { toStreamerDisplay } = useRouteLocation();
const toast = useToast();
const { state: authState, getMe } = useAuthStore();
const { t } = useI18n();

// const paymentInterval = ref<NodeJS.Timeout | undefined>(undefined);

const cancelPayment = () => {
  stopPaymentCheck();
  emit("cancel");
};

const runPaymentCheck = () => {
  init({
    path: "pages",
    query: { slug: props.reservedSlug },
  });
};
const stopPaymentCheck = () => {
  disconnect();
};

const { init, disconnect, connectionStatus, reconnect } =
  usePaymentSocket<PaymentSocketMessage>({
    onPaymentEvent: (data) => {
      console.log(data);

      if (!data.paidAt) return;

      toast.add({
        title: t("pageCreatedSuccessfully"),
      });
      disconnect();
      getMe();
      return navigateTo(toStreamerDisplay()?.path);
    },
  });

const handleRetry = () => {
  reconnect();
};

watch(active, (currentActive) => {
  if (currentActive) {
    runPaymentCheck();
  } else {
    stopPaymentCheck();
  }
});

onBeforeUnmount(() => stopPaymentCheck());
</script>

<template>
  <UModal v-model="active" preventClose>
    <PaymentModalContent
      title="Page Creation Fee"
      :qrCode="{
        address: reservedData?.paymentAddress,
        amount: reservedData?.amount,
        ticker: 'xmr',
      }"
      :connectionStatus="connectionStatus"
      @cancel="cancelPayment"
      @retry="handleRetry"
    >
      <template v-if="reservedData">
        <p class="pb-1.5 mb-2.5 text-gray-700 border-b border-border">
          {{ t("slugReservedUntil") }}
          {{ new Date(reservedData?.reservedUntil * 1000).toLocaleString() }}
        </p>
        <UAlert
          color="emerald"
          variant="subtle"
          :title="t('note')"
          class="text-xl"
        >
          <template #title>
            <h6 class="font-bold text-base uppercase">{{ t("note") }}</h6>
          </template>
          <template #description>
            <p class="text-[15px] leading-6">
              In order to prevent spam, please pay a small fee of
              <span class="font-bold">{{ reservedData.amount }} XMR</span> to
              the following address
            </p>
          </template>
        </UAlert>
      </template>
    </PaymentModalContent>
  </UModal>
</template>

<style scoped></style>
