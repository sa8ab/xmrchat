<script setup lang="ts">
import type { LiveStream } from "~/types";

const props = defineProps<{
  liveStream?: LiveStream;
}>();

const videoId = computed(() => props.liveStream?.videoId);

const iframeUrl = computed(() => {
  return `https://rumble.com/embed/v${videoId.value}`;
});
</script>

<template>
  <iframe
    v-if="iframeUrl"
    :src="iframeUrl"
    allowfullscreen
    class="w-full aspect-[16/9] rounded-md"
  ></iframe>
</template>
