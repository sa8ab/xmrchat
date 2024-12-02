<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    logoUrl?: string;
    bannerUrl?: string;
    showTitle?: boolean;
  }>(),
  {
    showTitle: true,
  }
);
</script>

<template>
  <div class="streamer-header">
    <div class="banner-container">
      <GeneralImage variant="banner" :url="bannerUrl" class="banner" />
    </div>
    <div class="options">
      <div class="logo-and-name">
        <GeneralImage :url="logoUrl" variant="logo" class="logo" />
        <div class="name p-2 flex flex-col" v-if="showTitle">
          <span class="text-2xl font-bold">Send Tip</span>
          <span class="text-pale">Streamer name</span>
        </div>
      </div>
      <StreamerLinks class="mt-2" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.streamer-header {
  --logo-size: 180px;
  .banner {
    @apply w-full;
  }
  .options {
    @apply flex justify-between items-start;
  }
  .logo-and-name {
    @apply flex gap-2;
  }
  .logo {
    margin-top: calc(var(--logo-size) / 2 * -1);
    @apply ml-4 w-[var(--logo-size)] h-[var(--logo-size)];
  }

  @media only screen and (max-width: 760px) {
    --logo-size: 120px;
    .options {
      @apply flex-col items-center;
    }
    .logo-and-name {
      @apply flex-col items-center;
    }
    .logo {
      @apply ml-0;
    }
  }
}
</style>
