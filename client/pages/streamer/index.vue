<script lang="ts" setup>
import { PageStatusEnum, type SupportedDisplayCurrency } from "~/types/enums";

useHead({
  title: "Profile",
});

const { getMyPage } = useServices();
const { t } = useI18n();

const { data, pending, refresh, error } = await useLazyAsyncData(
  "streamer-profile",
  () => getMyPage()
);

const tipValue = ref<SupportedDisplayCurrency | undefined>(
  data.value?.page.defaultTipAmountDisplay
);
</script>

<template>
  <div>
    <PendingView :pending="pending">
      <div v-if="!pending">
        <div v-if="data?.page">
          <StreamerHeader
            :logoUrl="data.page.logo.url"
            :bannerUrl="data.page.coverImage.url"
            :showTitle="false"
            class="mb-10"
          />

          <UAlert
            v-if="data.page.status === PageStatusEnum.DEACTIVE"
            color="red"
            variant="soft"
            :description="t('pageDeactivatedAlert')"
            class="my-4"
          />

          <div class="flex justify-end mb-2">
            <UTooltip
              :text="t('tipDisplayValueTooltip')"
              :popper="{ placement: 'top' }"
            >
              <TipValueToggle class="font-normal" v-model="tipValue" />
            </UTooltip>
          </div>

          <StreamerTipsList :slug="data.page.path" :tipValue="tipValue" />
        </div>
        <NoPageYet v-else />
      </div>
    </PendingView>
  </div>
</template>

<style scoped lang="scss"></style>
