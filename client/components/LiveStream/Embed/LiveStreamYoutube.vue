<script setup lang="ts">
import type { LiveStream } from "~/types";

const props = defineProps<{
  liveStream?: LiveStream;
}>();

const videoId = computed(() => props.liveStream?.videoId);

const iframeUrl = computed(() => {
  return `https://www.youtube.com/embed/${videoId.value}`;
});
</script>

<template>
  <iframe
    :src="iframeUrl"
    allowfullscreen
    class="w-full aspect-[16/9] rounded-md"
  ></iframe>
</template>
