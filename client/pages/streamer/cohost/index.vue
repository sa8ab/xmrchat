<script setup lang="ts">
import type { StreamerPage } from "~/types";
import { FiatEnum, TipDisplayMode } from "~/types/enums";

const authStore = useAuthStore();
const { axios } = useApp();
const { copy } = useCopy();
const url = useRequestURL();

const { getFiat } = useConstants();

const cohostPage = computed(() => authStore.state.user?.cohostPage);

const { data, pending, refresh, error } = await useLazyAsyncData(
  "cohost-page",
  async () => {
    const { data } = await axios.get<{ cohostPage: StreamerPage }>(
      "/cohosts/my-page"
    );
    return data.cohostPage;
  },
  { server: false }
);

const tipValue = ref<TipDisplayMode | undefined>(data.value?.tipDisplayMode);

const copyLink = () => {
  if (!cohostPage.value) return;
  copy(`${url.origin}/${cohostPage.value.path}/obs`);
};
</script>

<template>
  <div></div>
  <PageTitle
    title="Cohost Page"
    :description="`Manage ${cohostPage?.path || '-'} xmrchats`"
  />

  <div class="flex justify-end pb-2">
    <RemoveMyCohost />
  </div>

  <div v-if="pending">pending</div>
  <div v-else-if="error || !data">
    <!-- TODO: user UAlert component -->
    <span class="text-red-500">{{ getErrorMessage(error) }}</span>
  </div>
  <div v-else>
    <StreamerHeader
      :logoUrl="data.logo.url"
      :bannerUrl="data.coverImage.url"
      :showTitle="false"
      class="mb-10"
    />

    <div class="flex justify-between mb-2 gap-2 flex-wrap">
      <UButton
        icon="i-heroicons-document-duplicate"
        @click="copyLink"
        variant="outline"
        size="sm"
      >
        {{ $t("copyOBSLink") }}
      </UButton>
      <UTooltip
        :text="
          $t('tipDisplayValueTooltip', {
            fiat: getFiat(data.fiat || FiatEnum.USD).name,
          })
        "
        :popper="{ placement: 'top' }"
      >
        <TipValueToggle
          class="font-normal"
          v-model="tipValue"
          :fiat="data.fiat"
        />
      </UTooltip>
    </div>

    <StreamerTipsList
      :slug="data.path"
      :tipValue="tipValue"
      :fiat="data.fiat"
      :page="data"
      :showPrivateNameAndMessage="false"
      playSound
    />
  </div>
</template>
