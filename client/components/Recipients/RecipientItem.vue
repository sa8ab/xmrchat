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
  <div class="grid grid-cols-[1fr_100px_auto] gap-2">
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
        <div class="font-medium">Address</div>
        <p>4CscFcV...RQ8RZX</p>
      </div>
    </div>
    <div>
      <!-- percentage -->
      <div v-if="editablePercentage">
        <UFormGroup label="Percentage" size="lg">
          <UInput v-model="model.percentage" />
        </UFormGroup>
      </div>
      <div v-else>
        <div class="font-medium">Percentage</div>
        <p>80%</p>
      </div>
    </div>
    <div>
      <!-- delete -->
      <div v-if="showDelete">
        <span class="mb-1 flex text-sm">&nbsp;</span>
        <UButton color="red" size="lg">{{ $t("remove") }}</UButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
