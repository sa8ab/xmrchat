<script lang="ts" setup>
import type { Tip, TipReply } from "~/types";

const props = defineProps<{
  tip?: Tip;
  tipReply?: TipReply;
  pending?: boolean;
}>();

const model = defineModel<boolean>();

const message = ref("");
</script>

<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <h2 class="text-lg font-medium">Reply</h2>
      </template>

      <div class="text-sm">
        <span class="text-pale">Reply to tip: </span>
        <span>{{ tip?.name }}</span>
      </div>

      <div class="text-sm mt-2">
        <span class="text-pale">Message: </span>
        <span>{{ tip?.message }}</span>
      </div>

      <UFormGroup class="mt-4" name="message" label="Reply message">
        <UTextarea v-model="message" autoresize />
      </UFormGroup>

      <template #footer>
        <div class="flex items-center justify-between gap-2">
          <UButton color="red" variant="ghost">
            {{ $t("delete") }}
          </UButton>
          <div class="flex gap-2">
            <UButton variant="ghost" @click="model = false">
              {{ $t("cancel") }}
            </UButton>
            <UButton>
              {{ $t("save") }}
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
