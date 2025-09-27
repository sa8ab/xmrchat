<script setup lang="ts">
import type { LiveStream } from "~/types";

const props = defineProps<{
  liveStream?: LiveStream;
}>();

const emit = defineEmits<{
  play: [];
  pause: [];
}>();

const requestUrl = useRequestURL();

const videoId = computed(() => props.liveStream?.videoId);

const iframeUrl = computed(() => {
  return `https://player.twitch.tv/?video=${videoId.value}&parent=${requestUrl.host}`;
});
</script>

<template>
  <iframe
    :src="iframeUrl"
    allowfullscreen
    class="w-full aspect-[16/9] rounded-md"
  ></iframe>
</template>
