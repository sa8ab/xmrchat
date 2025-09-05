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
}>();

// State for switching between single and multi-recipient views
const showMultiRecipient = ref(false);
</script>

<template>
  <!-- Multi-recipient payment view -->
  <MultiRecipientPaymentContent
    v-if="showMultiRecipient"
    :createdTip="createdTip"
    :connectionStatus="connectionStatus"
    :partialPaymentAmount="partialPaymentAmount"
    :slug="slug"
    @cancel="emit('cancel')"
    @retry="emit('retry')"
    @back="showMultiRecipient = false"
  />

  <!-- Single recipient payment view -->
  <SingleRecipientPaymentContent
    v-else
    :createdTip="createdTip"
    :connectionStatus="connectionStatus"
    :partialPaymentAmount="partialPaymentAmount"
    :slug="slug"
    @cancel="emit('cancel')"
    @retry="emit('retry')"
    @showMultiRecipient="showMultiRecipient = true"
  />
</template>
