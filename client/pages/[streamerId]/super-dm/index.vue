<script setup lang="ts">
import type { SuperDmContent } from "#components";
import type { GeneratedKeys, PageSetting, SuperDmContentData } from "~/types";
import { PageSettingKey, TipDisplayMode } from "~/types/enums";

definePageMeta({
  hideHeaderLogin: true,
});

const route = useRoute();
const { axios } = useApp();
const streamerId = computed(() => route.params.streamerId as string);
const { getStreamerPage } = useServices();
const { saveViewerKeys } = useSuperDm();
const { toSuperDm } = useRouteLocation();
const contentRef = ref<InstanceType<typeof SuperDmContent> | undefined>();

const superDmRecoverModalActive = ref(false);

const { state: generalState } = useGeneralStore();

const { data, pending, refresh, error } = await useLazyAsyncData(
  `streamer-${streamerId.value}-super-dm`,
  async () => {
    const pageRequest = getStreamerPage(streamerId.value);
    const superDmSettingsRequest = axios.get<{ settings: PageSetting[] }>(
      `/page-settings/${streamerId.value}/super-dm`
    );
    const [page, { data: superDmSettings }] = await Promise.all([
      pageRequest,
      superDmSettingsRequest,
    ]);
    return {
      page,
      superDmSettings: superDmSettings.settings,
    };
  },
  {
    transform: (v) => {
      generalState.tipDisplayValue =
        v.page.tipDisplayMode || TipDisplayMode.FIAT;
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

const handlePaid = async () => {
  await saveViewerKeys({
    superDmId: created.value?.created.superDm.id as string,
    pagePath: streamerId.value,
    generatedKeys: created.value?.keys as GeneratedKeys,
  });

  paymentModalActive.value = false;
  await navigateTo(
    toSuperDm(streamerId.value, created.value?.created.superDm.id as string)
  );
  created.value = undefined;
  contentRef.value?.reset();
};

const handleRecover = () => {
  superDmRecoverModalActive.value = true;
};

defineOgImage(false);
useStreamerIdSeoMeta(computed(() => data.value?.page));
</script>

<template>
  <div class="inner pt-4">
    <PendingView :pending="pending" :error="error">
      <template v-if="data">
        <StreamerHeader
          class="pt-2"
          :bannerUrl="data.page.coverImage.url"
          :liveStreams="data.page.liveStreams"
          :logoUrl="data.page.logo.url"
          :name="data.page.name"
          :links="data.page.links"
        />
        <SuperDmContent
          ref="contentRef"
          :streamerId="streamerId"
          :streamerPage="data.page"
          :settings="data.superDmSettings"
          @done="handlePayment"
          @recover="handleRecover"
        />

        <SuperDmPaymentModal
          :data="created"
          :slug="streamerId"
          v-model:active="paymentModalActive"
          @cancel="cancelPayment"
          @paid="handlePaid"
        />
      </template>

      <SuperDmRecoverModal
        v-model="superDmRecoverModalActive"
        :pagePath="data?.page.path"
      />
    </PendingView>
  </div>
</template>
