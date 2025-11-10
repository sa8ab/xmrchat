<script setup lang="ts">
import type { PageTipTier } from "~/types";

const props = defineProps<{
  tiers?: PageTipTier[];
}>();

const { getPageTierColor } = useConstants();
const modalRef = ref(false);
</script>

<template>
  <div class="flex flex-wrap gap-1 mt-1">
    <div v-for="item in tiers" class="flex items-center gap-1">
      <button
        class="text-xs px-2 py-1 rounded-full flex flex-col items-center cursor-pointer hover:opacity-90 transition-opacity"
        :style="{
          background: item.color,
          color: getForegroundColor(item.color),
        }"
      >
        <span> {{ item.minAmount }} </span>
      </button>
    </div>

    <UButton
      icon="i-heroicons-question-mark-circle"
      size="xs"
      variant="ghost"
      color="gray"
      class="rounded-full"
      @click="modalRef = true"
    />
  </div>
  <UModal v-model="modalRef">
    <UCard>
      <template #header>
        <h2 class="text-lg font-medium">Tip Tiers</h2>
      </template>
      <div class="grid gap-4">
        <div v-for="item in tiers" class="flex items-center gap-2">
          <div
            class="w-2 h-full rounded-full"
            :style="{ background: item.color }"
          ></div>
          <div class="flex flex-col gap-1">
            <div class="text-lg font-medium">{{ item.name }}</div>
            <div>
              <span class="text-pale text-sm">Min. amount: </span>
              <span>{{ item.minAmount }}</span>
            </div>
            <div v-if="item.description">{{ item.description }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <UButton variant="soft" @click="modalRef = false">Close</UButton>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
