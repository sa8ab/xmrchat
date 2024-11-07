<script lang="ts" setup>
import type { ObsTip } from "~/types";

const props = defineProps<{
  tip?: ObsTip;
}>();

const isPrivate = computed(
  () => props.tip?.name === "" && props.tip?.message === ""
);
</script>

<template>
  <div class="obs-message flex items-center gap-4">
    <div class="image w-24 h-24">
      <img src="/images/xmrchat-logo.png" />
    </div>
    <div
      class="relative p-5 bg-background border border-border rounded-lg w-full text-lg"
      :class="{ 'text-pale': isPrivate }"
    >
      <ObsMessageHead :text="isPrivate ? 'Private' : tip?.name" />
      <div>
        {{ isPrivate ? `${props.tip?.amount}` : tip?.message }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
