<script setup lang="ts">
import type { LiveStream, Numberic } from "~/types";

const props = withDefaults(
  defineProps<{
    liveStreams?: LiveStream[];
    size?: Numberic;
  }>(),
  {
    size: 20,
  }
);

const { getLiveStreamPlatform } = useConstants();

const items = computed(() =>
  props.liveStreams
    ?.map((liveStream) => getLiveStreamPlatform(liveStream.platform))
    .filter((item) => !!item)
);
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-pale">Live on</span>
    <div class="flex flex-wrap gap-2">
      <UIcon
        v-for="item in items"
        :name="item.icon"
        :class="`${item.colorClassName}`"
        :size="size"
      />
    </div>
  </div>
</template>
