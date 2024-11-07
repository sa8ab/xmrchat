<script lang="ts" setup>
import type { Numberic, TipTier } from "~/types";

const props = defineProps<{
  tiers?: TipTier[];
}>();

const emit = defineEmits<{
  select: [Numberic];
}>();

const sortedTiers = computed(() =>
  props.tiers
    // To prevent values like .4 instead of 0.4
    ?.map((item) => ({
      ...item,
      amount: item.amount.startsWith(".") ? `0${item.amount}` : item.amount,
    }))
    .toSorted((a, b) => parseInt(a.amount) - parseInt(b.amount))
);

const handleClick = (item: TipTier) => {
  emit("select", item.amount);
};
</script>

<template>
  <div class="tiers flex flex-wrap gap-1 py-1">
    <UButton
      v-for="item of sortedTiers"
      @click="handleClick(item)"
      size="xs"
      square
      variant="soft"
    >
      ${{ item.amount }}
    </UButton>
  </div>
</template>

<style scoped lang="scss"></style>
