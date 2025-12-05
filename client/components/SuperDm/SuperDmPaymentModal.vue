<script lang="ts" setup>
import type { SuperDmContentData, TipEventData } from "~/types";

const props = defineProps<{
  created?: SuperDmContentData;
  slug?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  paid: [];
}>();

const active = defineModel<boolean>("active");
const paymentError = ref(false);
const partialPaymentAmount = ref<string | undefined>(undefined);

const authStore = useAuthStore();

const showWalletWarning = computed(
  () => authStore.state.page?.path === props.slug
);

const superDm = computed(() => props.created?.superDm);

const toast = useToast();
const { t } = useI18n();

const { init, disconnect, reconnect, connectionStatus } =
  usePaymentSocket<TipEventData>({
    onTipEvent: (data) => {
      if (!data.paidAt) {
        partialPaymentAmount.value = data.paidAmount;
        return;
      }

      partialPaymentAmount.value = undefined;
      toast.add({
        title: "Tip received successfully!",
      });
      disconnect();
      emit("paid");
    },

    onSwapStatusChangeEvent: (swap) => {
      console.log(swap);
      if (superDm.value?.swap) {
        superDm.value.swap.status = swap.status;
        superDm.value.swap.statusMessage = swap.statusMessage;
      }
    },
  });

const handleRetry = () => {
  reconnect();
};

const cancelPayment = () => {
  disconnect();
  partialPaymentAmount.value = undefined;
  emit("cancel");
};

const initSocket = () => {
  paymentError.value = false;
  init({
    path: "tips",
    query: { tipId: superDm.value?.id },
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
    <!-- <SuperDmSwapPaymentContent
      v-if="superDm?.swap"
      @retry="handleRetry"
      @cancel="cancelPayment"
      :createdTip="superDm"
      :connectionStatus="connectionStatus"
    >
    </SuperDmSwapPaymentContent> -->
    <SuperDmPaymentContent
      :createdTip="superDm"
      :connectionStatus="connectionStatus"
      :slug="slug"
      :partialPaymentAmount="partialPaymentAmount"
      @cancel="cancelPayment"
      @retry="handleRetry"
    >
    </SuperDmPaymentContent>
    <!-- <PaymentModalContent
      v-else
      :title="t('sendTip')"
      :qrCode="{
        address: createdTip?.paymentAddress,
        amount: createdTip?.amount,
        ticker: 'xmr',
      }"
      :connectionStatus="connectionStatus"
      :expiresAt="createdTip?.tip.expiresAt"
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
          <span>
            {{ t("tipWalletWarningTitle") }}
          </span>
        </template>
        <template #description>
          {{ t("tipWalletWarningDescription") }}
        </template>
        <template #icon>
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-[24px] h-[24px]"
          />
        </template>
      </UAlert>
      <template v-if="createdTip">
        <UAlert color="emerald" variant="subtle">
          <template #description>
            <p class="text-base">
              <I18nT keypath="tipWalletMinimum">
                <template #minimumAmount>
                  <span class="font-bold">{{ createdTip.amount }}</span>
                </template>
              </I18nT>
            </p>
          </template>
        </UAlert>
      </template>
    </PaymentModalContent> -->
  </UModal>
</template>

<style scoped></style>
