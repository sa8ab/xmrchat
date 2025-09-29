<script setup lang="ts">
import type { LiveStream } from "~/types";

const props = defineProps<{
  liveStream?: LiveStream;
}>();

const emit = defineEmits<{
  play: [];
  pause: [];
}>();

const videoId = computed(() => props.liveStream?.videoId);

const iframeUrl = computed(() => {
  return "https://rumble.com/embed/v6xexrq/";
  return `https://rumble.com/embed/${videoId.value}`;
});
</script>

<template>
  <iframe
    :src="iframeUrl"
    allowfullscreen
    class="w-full aspect-[16/9] rounded-md"
  ></iframe>
</template>
