<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    logoId?: string;
    bannerId?: string;
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
      <GeneralImage variant="banner" :id="bannerId" class="banner" />
    </div>
    <div class="options">
      <div class="logo-and-name">
        <GeneralImage :id="logoId" variant="logo" class="logo" />
        <div class="name font-bold text-2xl p-2" v-if="showTitle">Send Tip</div>
      </div>
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
