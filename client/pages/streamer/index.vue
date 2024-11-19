<script lang="ts" setup>
useHead({
  title: "Profile",
});

const { getMyPage } = useServices();

const { data, pending, refresh, error } = useLazyAsyncData(
  "streamer-profile",
  () => getMyPage()
);
</script>

<template>
  <div class="inner pt-4">
    <PendingView :pending="pending">
      <div class="pt-4" v-if="!pending">
        <div v-if="data?.page">
          <StreamerHeader
            :logoUrl="data.page.logo.url"
            :bannerUrl="data.page.coverImage.url"
            :showTitle="false"
            class="mb-10"
          />
          <StreamerTipsList :slug="data.page.path" />
        </div>
        <NoPageYet v-else />
      </div>
    </PendingView>
  </div>
</template>

<style scoped lang="scss"></style>
