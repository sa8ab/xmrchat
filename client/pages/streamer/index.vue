<script lang="ts" setup>
import type { SupportedDisplayCurrency } from "~/types/enums";

useHead({
  title: "Profile",
});

const { getMyPage } = useServices();

const { data, pending, refresh, error } = useLazyAsyncData(
  "streamer-profile",
  () => getMyPage(),
  {
    transform: (v) => {
      tipValue.value = v.page.defaultTipAmountDisplay;
      return v;
    },
  }
);

const tipValue = ref<SupportedDisplayCurrency | undefined>();
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

          <div class="flex justify-end mb-2">
            <UTooltip
              text="Show tip values in XMR or USD"
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
