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
}>();

// State for switching between single and multi-recipient views
const showMultiRecipient = ref(false);
</script>

<template>
  <!-- Multi-recipient payment view -->
  <BaseMultiRecipient
    v-if="showMultiRecipient"
    :data="data"
    :connectionStatus="connectionStatus"
    :partialPaymentAmount="partialPaymentAmount"
    :slug="slug"
    @retry="emit('retry')"
    @back="showMultiRecipient = false"
  />

  <!-- Single recipient payment view -->
  <BaseSingleRecipient
    v-else
    :data="data"
    :connectionStatus="connectionStatus"
    :partialPaymentAmount="partialPaymentAmount"
    :slug="slug"
    @retry="emit('retry')"
    @showMultiRecipient="showMultiRecipient = true"
  />
</template>
