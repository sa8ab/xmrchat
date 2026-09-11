<script setup lang="ts">
import type { LiveStream } from "~/types";

const props = defineProps<{
  liveStream?: LiveStream;
}>();

const broadcastId = computed(() => {
  const value = props.liveStream?.videoId;
  if (!value) return;
  const match = value.match(/\/i\/broadcasts\/([a-zA-Z0-9]+)/i);
  if (match) return match[1];
  if (/^[a-zA-Z0-9]+$/.test(value)) return value;
});

const iframeUrl = computed(() => {
  if (!broadcastId.value) return;
  return `https://studio.x.com/embed/broadcast/${broadcastId.value}`;
});
</script>

<template>
  <iframe
    v-if="iframeUrl"
    :src="iframeUrl"
    allowfullscreen
    class="w-full aspect-[16/9] rounded-md"
    title="X Broadcast"
  ></iframe>
</template>
