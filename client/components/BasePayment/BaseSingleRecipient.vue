<script lang="ts" setup>
import type { BasePaymentData } from "~/types";

const props = defineProps<{
  data?: BasePaymentData;
  connectionStatus?: string;
  partialPaymentAmount?: string;
  slug?: string;
}>();

const emit = defineEmits<{
  retry: [];
  showMultiRecipient: [];
}>();

const { expired, remaining, initialize } = usePaymentExpiration();

const remainingAmount = computed(() => {
  if (!props.data?.amount) return 0;
  if (!props.partialPaymentAmount) return 0;

  const amount = parseFloat(props.data?.amount); // value is in XMR
  const paidAmount = unitsToXmr(props.partialPaymentAmount); // value is in XMR units

  if (!amount || !paidAmount) return 0;

  return amount - paidAmount;
});

const hasMultiRecipients = computed(() => props.data?.recipients?.length);

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
  <SharedBasePaymentContent
    :amount="data?.amount"
    :remainingAmount="remainingAmount"
    :connectionStatus="connectionStatus"
    :partialPaymentAmount="partialPaymentAmount"
    :slug="slug"
    :expired="expired"
    :remaining="remaining"
    @retry="emit('retry')"
    @expired="expired = true"
  >
    <PaymentQRCode
      :address="data?.paymentAddress"
      :amount="remainingAmount || data?.amount"
      :ticker="'xmr'"
    />

    <UDivider label="OR" class="mb-3" />

    <PaymentAddressDisplay :address="data?.paymentAddress" class="mb-4" />

    <!-- Multi-recipient toggle button -->
    <div v-if="hasMultiRecipients" class="flex justify-center">
      <UButton
        variant="outline"
        @click="emit('showMultiRecipient')"
        class="mb-4"
      >
        <UIcon name="i-heroicons-users" class="w-4 h-4 mr-2" />
        {{ $t("splitPaymentToMultipleRecipients") }}
      </UButton>
    </div>
  </SharedBasePaymentContent>
</template>
