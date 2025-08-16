<script setup lang="ts">
import type { PageRecipient } from "~/types";

const model = defineModel<PageRecipient>({ default: () => ({}) });

const props = withDefaults(
  defineProps<{
    editableAddress?: boolean;
    editablePercentage?: boolean;
    showDelete?: boolean;
  }>(),
  {
    editableAddress: false,
    editablePercentage: false,
    showDelete: false,
  }
);
</script>

<template>
  <div class="grid grid-cols-[1fr_160px_auto] gap-2">
    <div>
      <!-- name and address -->
      <div v-if="editableAddress" class="flex gap-2">
        <UFormGroup label="Name" size="lg">
          <UInput v-model="model.name" />
        </UFormGroup>
        <UFormGroup label="Address" size="lg" class="flex-grow">
          <UInput v-model="model.address" />
        </UFormGroup>
      </div>
      <div v-else>
        <div class="font-medium">{{ model.name }}</div>
        <p>{{ model.address }}</p>
      </div>
    </div>
    <div>
      <!-- percentage -->
      <div v-if="editablePercentage">
        <UFormGroup label="Percentage %" size="lg">
          <UInput v-model="model.percentage" />
        </UFormGroup>
      </div>
      <div v-else>
        <div class="font-medium">Percentage</div>
        <p>{{ model.percentage }}%</p>
      </div>
    </div>
    <div class="min-w-[140px] flex justify-end">
      <!-- delete -->
      <div v-if="showDelete">
        <span class="mb-1 flex text-sm">&nbsp;</span>
        <UButton color="red" size="lg">{{ $t("remove") }}</UButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
