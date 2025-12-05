<script lang="ts" setup>
import type { SuperDmContentData } from "~/types";

const props = defineProps<{
  data?: SuperDmContentData;
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
  <!-- <MultiRecipientPaymentContent
    v-if="showMultiRecipient"
    :createdTip="createdTip"
    :connectionStatus="connectionStatus"
    :partialPaymentAmount="partialPaymentAmount"
    :slug="slug"
    @cancel="emit('cancel')"
    @retry="emit('retry')"
    @back="showMultiRecipient = false"
  /> -->

  <!-- Single recipient payment view -->
  <SuperDmSingleRecipientPaymentContent
    :data="data"
    :connectionStatus="connectionStatus"
    :partialPaymentAmount="partialPaymentAmount"
    :slug="slug"
    @cancel="emit('cancel')"
    @retry="emit('retry')"
    @showMultiRecipient="showMultiRecipient = true"
  />
</template>
