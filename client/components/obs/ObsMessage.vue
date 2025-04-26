<script lang="ts" setup>
import type { ObsTipSocketEvent } from "~/types";

const props = defineProps<{
  event?: ObsTipSocketEvent;
}>();

const isPrivate = computed(() => props.event?.tip?.private);
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
      <ObsMessageHead :text="isPrivate ? 'Private' : event?.tip?.name" />
      <div>
        {{
          isPrivate ? `${props.event?.tip?.payment?.amount}` : event?.message
        }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
