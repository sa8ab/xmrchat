<script lang="ts" setup>
import type { TipCreationResponse } from "~/types";
import VueCountdown from "@chenfengyuan/vue-countdown";

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

const { expired, remaining, initialize } = usePaymentExpiration();
const authStore = useAuthStore();

// State for switching between single and multi-recipient views
const showMultiRecipient = ref(false);

const remainingAmount = computed(() => {
  if (!props.createdTip?.amount) return 0;
  if (!props.partialPaymentAmount) return 0;

  const amount = parseFloat(props.createdTip.amount); // value is in XMR
  const paidAmount = unitsToXmr(props.partialPaymentAmount); // value is in XMR units

  if (!amount || !paidAmount) return 0;

  return amount - paidAmount;
});

const showWalletWarning = computed(
  () => authStore.state.page?.path === props.slug
);

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
  <TipPaymentViewContainer
    v-else
    :title="$t('sendTip')"
    @cancel="emit('cancel')"
  >
    <div class="w-full grid gap-2">
      <p v-if="expired" class="text-red-500 text-center">
        {{ $t("paymentIsExpired") }}
      </p>
      <template v-else>
        <UAlert
          v-if="showWalletWarning"
          color="orange"
          variant="subtle"
          class="mb-2"
        >
          <template #title>
            <span>
              {{ $t("tipWalletWarningTitle") }}
            </span>
          </template>
          <template #description>
            {{ $t("tipWalletWarningDescription") }}
          </template>
          <template #icon>
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-[24px] h-[24px]"
            />
          </template>
        </UAlert>

        <UAlert v-if="createdTip" color="emerald" variant="subtle">
          <template #description>
            <p class="text-base">
              <I18nT keypath="tipWalletMinimum" scope="global">
                <template #minimumAmount>
                  <span class="font-bold">{{ createdTip.amount }}</span>
                </template>
              </I18nT>
            </p>
          </template>
        </UAlert>

        <UAlert
          v-if="partialPaymentAmount"
          color="orange"
          variant="subtle"
          class="mt-2"
        >
          <template #description>
            <p v-if="partialPaymentAmount" class="text-base">
              <I18nT keypath="partialAmountReceived" scope="global">
                <template #partialAmount>
                  <span class="font-bold"
                    >{{ unitsToXmr(partialPaymentAmount) }}
                  </span>
                  XMR
                </template>
                <template #remainingAmount>
                  <span class="font-bold">{{ remainingAmount }} </span> XMR
                </template>
              </I18nT>
            </p>
          </template>
        </UAlert>

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
            @click="showMultiRecipient = true"
            class="mb-4"
          >
            <UIcon name="i-heroicons-users" class="w-4 h-4 mr-2" />
            {{ $t("splitPaymentToMultipleRecipients") }}
          </UButton>
        </div>

        <PaymentError
          v-if="connectionStatus === 'DISCONNECTED'"
          @retry="emit('retry')"
        />
        <PaymentLoading v-else />

        <VueCountdown v-if="remaining" :time="remaining" @end="expired = true">
          <template #default="{ minutes, seconds }">
            <p class="text-center">
              {{ minutes.toString().padStart(2, "0") }}:{{
                seconds.toString().padStart(2, "0")
              }}
            </p>
          </template>
        </VueCountdown>
      </template>
    </div>
  </TipPaymentViewContainer>
</template>
