<script lang="ts" setup>
import type { TipCreationResponse } from "~/types";

const props = defineProps<{
  createdTip?: TipCreationResponse;
  connectionStatus?: string;
  partialPaymentAmount?: string;
  slug?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  retry: [];
  showMultiRecipient: [];
}>();

const { expired, remaining, initialize } = usePaymentExpiration();

const remainingAmount = computed(() => {
  if (!props.createdTip?.amount) return 0;
  if (!props.partialPaymentAmount) return 0;

  const amount = parseFloat(props.createdTip.amount); // value is in XMR
  const paidAmount = unitsToXmr(props.partialPaymentAmount); // value is in XMR units

  if (!amount || !paidAmount) return 0;

  return amount - paidAmount;
});

const hasMultiRecipients = computed(
  () => props.createdTip?.tipRecipients?.length
);

// Using watch cause we are not sure if when component mounts the props are passed to it.
watch(
  () => props.createdTip?.tip.expiresAt,
  (v) => {
    if (v) initialize(v);
  },
  { immediate: true }
);
</script>

<template>
  <TipPaymentViewContainer :title="$t('sendTip')" @cancel="emit('cancel')">
    <SharedPaymentContent
      :createdTip="createdTip"
      :connectionStatus="connectionStatus"
      :partialPaymentAmount="partialPaymentAmount"
      :slug="slug"
      :expired="expired"
      :remaining="remaining"
      @retry="emit('retry')"
      @expired="expired = true"
    >
      <PaymentQRCode
        :address="createdTip?.paymentAddress"
        :amount="remainingAmount || createdTip?.amount"
        :ticker="'xmr'"
      />

      <UDivider label="OR" class="mb-3" />

      <PaymentAddressDisplay
        :address="createdTip?.paymentAddress"
        class="mb-4"
      />

      <!-- Multi-recipient toggle button -->
      <div class="flex justify-center">
        <UButton
          v-if="hasMultiRecipients"
          variant="outline"
          @click="emit('showMultiRecipient')"
          class="mb-4"
        >
          <UIcon name="i-heroicons-users" class="w-4 h-4 mr-2" />
          {{ $t("splitPaymentToMultipleRecipients") }}
        </UButton>
      </div>
    </SharedPaymentContent>
  </TipPaymentViewContainer>
</template>
