<script setup lang="ts">
import type { LiveStream } from "~/types";

const props = defineProps<{
  liveStream?: LiveStream;
}>();

const requestUrl = useRequestURL();

const channelId = computed(() => props.liveStream?.channelName);

const iframeUrl = computed(() => {
  return `https://player.twitch.tv/?channel=${channelId.value}&parent=${requestUrl.hostname}&autoplay=false`;
});
</script>

<template>
  <iframe
    :src="iframeUrl"
    allowfullscreen
    class="w-full aspect-[16/9] rounded-md"
  ></iframe>
</template>
