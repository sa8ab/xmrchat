<script lang="ts" setup>
import type { ContentLink, LiveStream } from "~/types";

const props = withDefaults(
  defineProps<{
    logoUrl?: string;
    bannerUrl?: string;
    liveStreams?: LiveStream[];
    showTitle?: boolean;
    name?: string;
    links?: ContentLink[];
    streamerId?: string;
    superDmActive?: boolean;
  }>(),
  {
    showTitle: true,
  }
);

const { toSuperDmCreate } = useRouteLocation();
const { liveStream, livePlatforms } = useLiveStreamPlayer(
  computed(() => props.liveStreams)
);

const showLogo = computed(() => !liveStream.value);
const verified = computed(() => props.links?.some((l) => l.verification));
</script>

<template>
  <div class="streamer-header">
    <LiveStreamPlayer v-if="liveStream" :liveStream="liveStream" />
    <div v-else class="banner-container">
      <GeneralImage variant="banner" :url="bannerUrl" class="banner" />
    </div>
    <div class="options">
      <div class="logo-and-name">
        <div class="flex flex-col items-center ms-4">
          <GeneralImage
            v-if="showLogo"
            :url="logoUrl"
            variant="logo"
            class="logo"
          />

          <div v-if="superDmActive" class="relative mt-4">
            <!-- <UBadge class="absolute -top-2 right-0 text-xs" size="xs">
              NEW
            </UBadge> -->
            <UButton
              :to="toSuperDmCreate(String(streamerId))"
              size="sm"
              type="button"
              variant="outline"
              icon="i-heroicons-chat-bubble-left-right"
            >
              SuperDM
            </UButton>
          </div>
        </div>
        <div class="name p-2 flex flex-col flex-1" v-if="showTitle">
          <div class="flex items-center gap-1">
            <span class="text-lg lg:text-2xl font-bold">{{ name }}</span>
            <VerifiedBadge :links="links" />
          </div>
          <!-- <span class="text-pale">Streamer name</span> -->
          <StreamerLinks
            class="mt-3"
            :links="links"
            :livePlatforms="livePlatforms"
          />
        </div>
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
    @apply w-[var(--logo-size)] h-[var(--logo-size)];
  }

  @media only screen and (max-width: 760px) {
    --logo-size: 108px;
  }
}
</style>
