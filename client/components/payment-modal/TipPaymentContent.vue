<script lang="ts" setup>
import type { TipCreationResponse } from "~/types";
import VueCountdown from "@chenfengyuan/vue-countdown";

const props = defineProps<{
  createdTip?: TipCreationResponse;
  connectionStatus?: string;
  slug?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  retry: [];
}>();

const { expired, remaining, initialize } = usePaymentExpiration();
const authStore = useAuthStore();

const showLoading = computed(() => !expired.value);
const showAddress = computed(() => !expired.value);

const showWalletWarning = computed(
  () => authStore.state.page?.path === props.slug
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
    <div class="w-full grid gap-2">
      <p v-if="expired" class="text-red-500 text-center">
        Payment is expired. If you have already sent your payment please contact
        support.
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
              <I18nT keypath="tipWalletMinimum">
                <template #minimumAmount>
                  <span class="font-bold">{{ createdTip.amount }}</span>
                </template>
              </I18nT>
            </p>
          </template>
        </UAlert>

        <PaymentQRCode
          :address="createdTip?.paymentAddress"
          :amount="createdTip?.amount"
          :ticker="'xmr'"
        />

        <UDivider label="OR" class="mb-3" />

        <PaymentAddressDisplay
          :address="createdTip?.paymentAddress"
          class="mb-4"
        />

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
