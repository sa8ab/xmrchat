<script setup lang="ts">
import type { LiveStream } from "~/types";
import { LiveStreamPlatformEnum } from "~/types/enums";

const props = defineProps<{
  liveStream?: LiveStream;
}>();

const emit = defineEmits<{
  play: [];
  pause: [];
}>();

const type = computed(() => props.liveStream?.platform);
</script>

<template>
  <LiveStreamYoutube
    v-if="type === LiveStreamPlatformEnum.YOUTUBE"
    :liveStream="liveStream"
    @play="emit('play')"
    @pause="emit('pause')"
  />
</template>
