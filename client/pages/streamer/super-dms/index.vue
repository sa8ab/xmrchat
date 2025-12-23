<script setup lang="ts">
const props = defineProps<{
  superDmsCount?: number;
  pending?: boolean;
}>();
</script>

<template>
  <div class="flex flex-col gap-2 items-center py-6 text-center">
    <template v-if="pending">
      <USkeleton class="h-6 w-[200px]" />
      <USkeleton class="h-4 w-[300px]" />
    </template>
    <template v-else-if="superDmsCount">
      <p class="font-medium text-lg">No SuperDMs selected.</p>
      <p class="text-pale text-sm">Select a to view messages.</p>
    </template>
    <template v-else>
      <p class="font-medium text-lg">No SuperDMs received yet.</p>
    </template>
  </div>
</template>

<style scoped></style>
