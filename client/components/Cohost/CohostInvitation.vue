<script setup lang="ts">
import type { CohostInvitation } from "~/types";

const props = defineProps<{
  invitation: CohostInvitation;
}>();

const emit = defineEmits<{
  cancel: [];
}>();

const { dayjs, relativeDate } = useDate();

const pendingCancel = ref(false);

// TODO: Add cancel
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
        <p class="text-pale text-sm">
          <span v-if="dayjs(invitation.expiresAt).isBefore(dayjs())">
            Expired
          </span>
          <span v-else> expires {{ relativeDate(invitation.expiresAt) }} </span>
        </p>
      </div>
      <div>
        <UButton color="red">Cancel</UButton>
        <!-- actions -->
      </div>
    </div>
  </div>
</template>
