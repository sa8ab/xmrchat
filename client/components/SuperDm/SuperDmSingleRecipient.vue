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
  showMultiRecipient: [];
}>();

const { expired, remaining, initialize } = usePaymentExpiration();

const created = computed(() => props.data?.created);

const remainingAmount = computed(() => {
  if (!created.value?.amount) return 0;
  if (!props.partialPaymentAmount) return 0;

  const amount = parseFloat(created.value?.amount); // value is in XMR
  const paidAmount = unitsToXmr(props.partialPaymentAmount); // value is in XMR units

  if (!amount || !paidAmount) return 0;

  return amount - paidAmount;
});

const hasMultiRecipients = computed(() => created.value?.recipients?.length);
const keysSaved = ref(false);

// Using watch cause we are not sure if when component mounts the props are passed to it.
watch(
  [() => created.value?.superDm?.expiresAt, () => keysSaved.value],
  ([v]) => {
    if (v) initialize(v);
  },
  { immediate: true }
);
</script>

<template>
  <BasePaymentCard title="Start Super DM" @cancel="emit('cancel')">
    <SharedBasePaymentContent
      v-if="keysSaved"
      :amount="created?.amount"
      :remainingAmount="remainingAmount"
      :connectionStatus="connectionStatus"
      :partialPaymentAmount="partialPaymentAmount"
      :slug="slug"
      :expired="expired"
      :remaining="remaining"
      @retry="emit('retry')"
      @expired="expired = true"
    >
      <template #before-content>
        <div class="flex mb-2">
          <UButton variant="link" :padded="false" @click="keysSaved = false">
            <DirectionalArrow direction="backward" />
            Show keys again
          </UButton>
        </div>
      </template>

      <PaymentQRCode
        :address="created?.paymentAddress"
        :amount="remainingAmount || created?.amount"
        :ticker="'xmr'"
      />

      <UDivider label="OR" class="mb-3" />

      <PaymentAddressDisplay :address="created?.paymentAddress" class="mb-4" />

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

    <SuperDmIdAndKey
      v-else
      :superDmId="created?.superDm.id"
      :recoveryKey="data?.keys?.mnemonic"
      @saved="keysSaved = true"
    />
  </BasePaymentCard>
</template>
