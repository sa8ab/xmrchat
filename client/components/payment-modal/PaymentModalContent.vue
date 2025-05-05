<script lang="ts" setup>
import dayjs from "dayjs";
import type { PaymentQRCodeProps } from "./PaymentQRCode.vue";
import VueCountdown from "@chenfengyuan/vue-countdown";

interface Props {
  title?: string;
  qrCode?: PaymentQRCodeProps;
  connectionStatus?: string;
  expiresAt?: string;
  showRemainingTime?: boolean;
  expiredMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showRemainingTime: true,
  expiredMessage:
    "Payment is expired. If you have already sent your payment please contact support.",
});

const emit = defineEmits<{
  cancel: [];
  retry: [];
  expired: [];
}>();

const remaining = ref<number | undefined>();
const expired = defineModel<boolean>("expired", { default: false });

const getRemainingTime = () => {
  console.log("getting remaining time");

  const now = dayjs();
  const expiresAt = dayjs(props.expiresAt);

  remaining.value = expiresAt.diff(now);

  if (remaining.value < 0) expired.value = true;

  // countdown.value?.start();
};

watch(
  () => props.expiresAt,
  (v) => {
    if (v) getRemainingTime();
  },
  { immediate: true }
);
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-bold text-base">{{ title }}</h2>
    </template>
    <slot />
    <div class="w-full flex flex-col gap-2 pt-4">
      <p class="text-red-500 text-center" v-if="expired">
        {{ expiredMessage }}
      </p>
      <template v-else>
        <PaymentQRCode v-if="qrCode" v-bind="qrCode" />
        <UDivider label="OR" class="mb-3" />
        <PaymentAddressDisplay :address="qrCode?.address" class="mb-4" />
        <PaymentError
          v-if="connectionStatus === 'DISCONNECTED'"
          @retry="emit('retry')"
        />
        <PaymentLoading v-else />
        <VueCountdown
          v-if="remaining && showRemainingTime"
          :time="remaining"
          @end="expired = true"
        >
          <template #default="{ minutes, seconds }">
            <p class="text-center">
              {{ minutes.toString().padStart(2, "0") }}:{{
                seconds.toString().padStart(2, "0")
              }}
            </p>
          </template>
        </VueCountdown>
      </template>

      <!-- <span class="text-sm text-pale" v-if="expiresAt">
        Your XMRChat is valid until
        <span class="text-text">{{ formatTime(expiresAt) }}</span
        >.
      </span> -->
    </div>

    <slot name="after" />
    <div class="flex justify-end pt-3">
      <UButton variant="outline" @click="emit('cancel')">
        {{ $t("cancel") }}
      </UButton>
    </div>
  </UCard>
</template>

<style scoped lang="scss">
.qr-code {
  @apply w-[300px] h-[300px] bg-gray-800;
}
</style>
