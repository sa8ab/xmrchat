<script lang="ts" setup>
import type { ObsTipSocketEvent } from "~/types";

const props = defineProps<{
  event?: ObsTipSocketEvent;
}>();

const isPrivate = computed(() => props.event?.tip?.private);
const { markdownAndSanitize } = useMarkdown();
const tier = computed(() => props.event?.tip?.pageTipTier);
const tierColor = computed(() => tier.value?.color);
const itemStyle = computed(() => {
  if (!tierColor.value) return undefined;
  return {
    background: tierColor.value,
    color: getForegroundColor(tierColor.value),
  };
});
const headStyle = computed(() => {
  if (!tierColor.value) return undefined;
  return {
    background: getForegroundColor(tierColor.value),
    color: tierColor.value,
  };
});
</script>

<template>
  <div
    :class="[
      'obs-message flex items-center gap-4',
      { 'has-tier-color': tierColor },
    ]"
  >
    <div class="image w-24 h-24">
      <img src="/images/xmrchat-logo.png" />
    </div>
    <div
      class="relative p-5 bg-background border border-border rounded-lg w-full text-lg break-words"
      :class="{ 'text-pale': isPrivate }"
      :style="itemStyle"
    >
      <ObsMessageHead
        :text="isPrivate ? 'Private' : event?.tip?.name"
        :style="headStyle"
      />
      <div
        style="word-break: break-word"
        v-html="markdownAndSanitize(event?.message)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.has-tier-color {
  a {
    color: inherit !important;
  }
}
</style>
