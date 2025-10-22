<script setup lang="ts">
import type { User } from "~/types";

const props = defineProps<{
  cohost: User;
}>();

const emit = defineEmits<{
  remove: [];
}>();

const { dayjs, relativeDate } = useDate();

const pendingRemove = ref(false);

// TODO: Add remove
</script>

<template>
  <div class="grid gap-2">
    <div
      class="rounded-lg ring-1 ring-border px-6 py-4 flex gap-3 items-center"
    >
      <div
        class="p-2 rounded-full ring-1 ring-border flex items-center justify-center"
      >
        <UIcon name="i-heroicons-user" size="20" />
      </div>
      <div class="flex-1">
        <p class="font-medium">email</p>
      </div>
      <div>
        <UButton color="red" variant="ghost">Remove</UButton>
      </div>
    </div>
  </div>
</template>
