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
    const superDmStateRequest = axios.get<{
      active: boolean;
      configured: boolean;
    }>(`/super-dms/${streamerId.value}/settings/state`);
    const [page, { data: superDmSettings }, { data: superDmState }] =
      await Promise.all([
        pageRequest,
        superDmSettingsRequest,
        superDmStateRequest,
      ]);
    return {
      page,
      superDmSettings: superDmSettings.settings,
      superDmState,
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

const pageName = computed(() => data.value?.page.name || data.value?.page.path);
</script>

<template>
  <div class="inner pt-4 !max-w-[800px]">
    <PendingView :pending="pending" :error="error">
      <template v-if="data">
        <div class="flex items-center gap-2 pt-6">
          <GeneralImage
            :url="data.page.logo.url"
            variant="logo"
            class="logo w-20 h-20"
          />
          <span class="text-lg lg:text-2xl font-bold">{{ pageName }}</span>
        </div>

        <p class="text-sm text-pale pt-6">
          Start or continue your SuperDM private conversation with
          {{ pageName }}. The conversation is fully end to end encrypted. After
          starting a SuperDM, you'll need the SuperDM ID and recovery code, or
          the saved key in your browser to return to it.
        </p>
        <SuperDmContent
          ref="contentRef"
          :streamerId="streamerId"
          :streamerPage="data.page"
          :settings="data.superDmSettings"
          :superDmConfigured="data.superDmState.configured"
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
