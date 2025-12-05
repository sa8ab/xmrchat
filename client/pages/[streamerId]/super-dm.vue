<script setup lang="ts">
import type { SuperDmContent } from "#components";
import type { GeneratedKeys, SuperDmContentData } from "~/types";
import { TipDisplayMode } from "~/types/enums";

definePageMeta({
  hideHeaderLogin: true,
});

const route = useRoute();
const streamerId = computed(() => route.params.streamerId as string);
const { getStreamerPage } = useServices();
const contentRef = ref<InstanceType<typeof SuperDmContent> | undefined>();

const { state: generalState } = useGeneralStore();

const { data, pending, refresh, error } = await useLazyAsyncData(
  `streamer-${streamerId.value}`,
  () => getStreamerPage(streamerId.value),
  {
    transform: (v) => {
      generalState.tipDisplayValue = v.tipDisplayMode || TipDisplayMode.FIAT;
      return v;
    },
  }
);

if (error.value) {
  throw createError(error.value);
}

const created = ref<SuperDmContentData | undefined>(undefined);
const paymentModalActive = ref(false);

const handlePayment = (data: SuperDmContentData) => {
  paymentModalActive.value = true;
  created.value = data;
};

const cancelPayment = () => {
  paymentModalActive.value = false;
  created.value = undefined;
};

const handlePaid = () => {
  paymentModalActive.value = false;
  created.value = undefined;
  // contentRef.value?.reset();
};

defineOgImage(false);
useStreamerIdSeoMeta(data);
</script>

<template>
  <div class="inner pt-4">
    <div v-if="pending && !data">Pending</div>

    <div v-else-if="error">{{ getErrorMessage(error) }}</div>

    <template v-else-if="data">
      <StreamerHeader
        class="pt-2"
        :bannerUrl="data.coverImage.url"
        :liveStreams="data.liveStreams"
        :logoUrl="data?.logo.url"
        :name="data.name"
        :links="data.links"
      />
      <SuperDmContent
        ref="contentRef"
        :streamerId="streamerId"
        :streamerPage="data"
        @done="handlePayment"
      />

      <SuperDmPaymentModal
        :created="created"
        :slug="streamerId"
        v-model:active="paymentModalActive"
        @cancel="cancelPayment"
        @paid="handlePaid"
      />
    </template>
  </div>
</template>
