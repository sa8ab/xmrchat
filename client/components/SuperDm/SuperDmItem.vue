<script setup lang="ts">
import type { SuperDm } from "~/types";

const props = defineProps<{
  superDm: SuperDm;
}>();

const { dayjs } = useDate();
const { toStreamerSuperDm } = useRouteLocation();
</script>

<template>
  <ULink
    :to="toStreamerSuperDm(superDm.id)"
    class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-background-2/50 transition-all"
    activeClass="!bg-primary !text-white"
  >
    <div
      class="w-8 h-8 rounded-full ring-1 ring-border flex items-center justify-center"
    >
      <UAvatar :alt="superDm.name" />
    </div>
    <div>
      <p class="font-medium">{{ superDm.name }}</p>
      <p class="opacity-80 text-xs">
        {{ dayjs(superDm.createdAt).format("L LT") }}
      </p>
    </div>
  </ULink>
</template>

<style scoped></style>
