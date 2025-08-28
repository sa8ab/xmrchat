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
  back: [];
}>();

const { expired, remaining, initialize } = usePaymentExpiration();

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
      <!-- Multi-recipient QR Code -->
      <PaymentQRCode :qrCodeUrl="createdTip?.url" :ticker="'xmr'" />

      <UDivider label="OR" class="mb-3" />

      <!-- Multi-recipient addresses display -->
      <div class="space-y-3 mb-4">
        <h3 class="text-lg font-semibold text-center">
          {{ $t("recipients") }}
        </h3>
        <div
          v-for="(recipient, index) in createdTip?.tipRecipients"
          :key="index"
          class="p-3 border border-border rounded-lg"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h4 class="font-medium">
                {{ recipient.name || `Recipient ${index + 1}` }}
              </h4>
              <p class="text-sm text-muted-foreground">
                {{ recipient.percentage }}%
              </p>
            </div>
            <div class="text-right">
              <p class="font-bold">{{ recipient.amount }} XMR</p>
            </div>
          </div>
          <PaymentAddressDisplay :address="recipient.address" compact />
        </div>
      </div>

      <!-- Back to single payment button -->
      <div class="flex justify-center">
        <UButton variant="outline" @click="emit('back')" class="mb-4">
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
          {{ $t("backToSinglePayment") }}
        </UButton>
      </div>
    </SharedPaymentContent>
  </TipPaymentViewContainer>
</template>
