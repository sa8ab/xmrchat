<script lang="ts" setup>
import type { TipContent } from "#components";
import type { TipCreationResponse } from "~/types";
import { SupportedDisplayCurrency } from "~/types/enums";

definePageMeta({
  hideHeaderLogin: true,
});

const route = useRoute();
const streamerId = computed(() => route.params.streamerId as string);
const { getStreamerPage } = useServices();
const { state: generalState } = useGeneralStore();
const contentRef = ref<InstanceType<typeof TipContent> | undefined>();

const { data, pending, refresh, error } = await useLazyAsyncData(
  `streamer-${streamerId.value}`,
  () => getStreamerPage(streamerId.value),
  {
    transform: (v) => {
      generalState.tipDisplayValue =
        v.defaultTipAmountDisplay || SupportedDisplayCurrency.USD;
      return v;
    },
  }
);

const createdTip = ref<TipCreationResponse | undefined>(undefined);
const paymentModalActive = ref(false);

const handlePayment = (data: TipCreationResponse) => {
  paymentModalActive.value = true;
  createdTip.value = data;
};

const cancelPayment = () => {
  paymentModalActive.value = false;
  createdTip.value = undefined;
};

const handlePaid = () => {
  paymentModalActive.value = false;
  createdTip.value = undefined;
  contentRef.value?.reset();
};

useStreamerIdSeoMeta(data);
</script>

<template>
  <div class="inner pt-4">
    <PendingView :pending="pending" :error="error">
      <template v-if="data">
        <StreamerHeader
          class="pt-2"
          :bannerUrl="data.coverImage.url"
          :logoUrl="data?.logo.url"
          :name="data.name"
          :links="data.links"
        />
        <TipContent
          ref="contentRef"
          :streamerId="streamerId"
          :streamerPage="data"
          @done="handlePayment"
        />
        <TipPaymentModal
          :createdTip="createdTip"
          :slug="streamerId"
          v-model:active="paymentModalActive"
          @cancel="cancelPayment"
          @paid="handlePaid"
        />
      </template>
    </PendingView>
  </div>
</template>

<style scoped lang="scss"></style>
