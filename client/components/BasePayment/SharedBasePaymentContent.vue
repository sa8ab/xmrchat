<script lang="ts" setup>
import type { TipCreationResponse } from "~/types";
import VueCountdown from "@chenfengyuan/vue-countdown";

const props = defineProps<{
  amount?: string | number;
  connectionStatus?: string;
  partialPaymentAmount?: string;
  slug?: string;
  expired?: boolean;
  remaining?: number;
  remainingAmount?: number;
}>();

const emit = defineEmits<{
  retry: [];
  expired: [];
}>();

const paymentModalInject = inject<{ minMinAmountKey?: string }>(
  "paymentModalProvideKey"
);

const authStore = useAuthStore();

const showWalletWarning = computed(
  () => authStore.state.page?.path === props.slug
);
</script>

<template>
  <div class="w-full grid gap-2">
    <p v-if="expired" class="text-red-500 text-center">
      {{ $t("paymentIsExpired") }}
    </p>
    <template v-else>
      <slot name="before-content" />

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

      <UAlert v-if="amount" color="emerald" variant="subtle">
        <template #description>
          <p class="text-base">
            <I18nT
              :keypath="
                paymentModalInject?.minMinAmountKey || 'tipWalletMinimum'
              "
              scope="global"
            >
              <template #minimumAmount>
                <span class="font-bold">{{ amount }}</span>
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

      <!-- Slot for custom content (QR code, addresses, etc.) -->
      <slot />

      <PaymentError
        v-if="connectionStatus === 'DISCONNECTED'"
        @retry="emit('retry')"
      />
      <PaymentLoading v-else />

      <VueCountdown v-if="remaining" :time="remaining" @end="$emit('expired')">
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
</template>
