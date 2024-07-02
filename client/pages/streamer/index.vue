<script lang="ts" setup>
useHead({
  title: "Profile",
});

const { getMyPage } = useServices();

const { data, pending, refresh, error } = useLazyAsyncData(
  "streamer-profile",
  () => getMyPage(),
);
</script>

<template>
  <div class="inner pt-4">
    <PendingView :error="error" :pending="pending">
      <div class="pt-4" v-if="!pending">
        <div v-if="data">
          <StreamerHeader
            :slug="data.path"
            actions
            :logoId="data.logo"
            :bannerId="data.cover_image"
            class="mb-10"
          />
          <StreamerTipsList :slug="data.path" />
        </div>
        <NoPageYet v-else />
      </div>
    </PendingView>
  </div>
</template>

<style scoped lang="scss"></style>
