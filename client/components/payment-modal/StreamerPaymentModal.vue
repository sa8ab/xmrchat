<script lang="ts" setup>
import type { PaymentSocketMessage, SlugReservationResponse } from "~/types";
import VueCountdown from "@chenfengyuan/vue-countdown";
import type { FiatEnum } from "~/types/enums";

const props = defineProps<{
  reservedData?: SlugReservationResponse;
  reservedSlug?: string;
  fiat?: FiatEnum;
}>();

const emit = defineEmits<{
  cancel: [];
}>();

const active = defineModel<boolean>("active");

const { toStreamerDisplay } = useRouteLocation();
const toast = useToast();
const { state: authState, getMe } = useAuthStore();
const { t } = useI18n();
const { dayjs } = useDate();

const cancelPayment = () => {
  stopPaymentCheck();
  expired.value = false;
  emit("cancel");
};

const runPaymentCheck = () => {
  init({
    path: "pages",
    query: { slug: props.reservedSlug },
  });
};
const stopPaymentCheck = () => {
  disconnect();
};

const { init, disconnect, connectionStatus, reconnect } =
  usePaymentSocket<PaymentSocketMessage>({
    onPaymentEvent: (data) => {
      console.log(data);

      if (!data.paidAt) return;

      toast.add({
        title: t("pageCreatedSuccessfully"),
      });
      disconnect();
      getMe();
      return navigateTo(toStreamerDisplay()?.path);
    },
  });

const handleRetry = () => {
  reconnect();
};

watch(active, (currentActive) => {
  if (currentActive) {
    runPaymentCheck();
  } else {
    stopPaymentCheck();
  }
});

onBeforeUnmount(() => stopPaymentCheck());

const expired = ref<boolean>(false);

const handleExpired = () => {
  expired.value = true;
};

const { xmrToFiat } = useXmrPrice();
const { money } = useMoney();

const fiatAmount = computed(() => {
  if (!props.fiat) return undefined;
  return money(
    xmrToFiat(props.reservedData?.amount, props.fiat).toFixed(2),
    props.fiat
  );
});

const getTime = () => {
  return (
    dayjs(props.reservedData?.reservedUntil).diff(dayjs(), "seconds") * 1000
  );
};
</script>

<template>
  <UModal v-model="active" preventClose>
    <PaymentModalContent
      v-model:expired="expired"
      title="Page Creation Fee"
      :qrCode="{
        address: reservedData?.paymentAddress,
        amount: reservedData?.amount,
        ticker: 'xmr',
      }"
      :connectionStatus="connectionStatus"
      expiredMessage="Page reservation expired."
      @cancel="cancelPayment"
      @retry="handleRetry"
    >
      <template v-if="reservedData && !expired">
        <UAlert
          color="emerald"
          variant="subtle"
          :title="t('note')"
          class="text-xl"
        >
          <template #title>
            <h6 class="font-bold text-base uppercase">{{ t("note") }}</h6>
          </template>
          <template #description>
            <p class="text-[15px] leading-6">
              Please pay a small spam prevention fee of
              <span class="font-bold">{{ reservedData.amount }} XMR</span> in
              the next
              <VueCountdown
                v-if="reservedData?.reservedUntil"
                :time="getTime()"
                @end="handleExpired"
              >
                <template #default="{ minutes, seconds, hours }">
                  <span class="text-center">
                    {{ minutes.toString().padStart(2, "0") }}:{{
                      seconds.toString().padStart(2, "0")
                    }}
                  </span>
                </template>
              </VueCountdown>
              to create your tip page.
            </p>
          </template>
        </UAlert>
      </template>
    </PaymentModalContent>
  </UModal>
</template>

<style scoped></style>
