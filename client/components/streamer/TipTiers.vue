<script lang="ts" setup>
import type { Numberic, TipTier } from "~/types";

const props = defineProps<{
  tiers?: TipTier[];
}>();

const emit = defineEmits<{
  select: [Numberic];
}>();

const sortedTiers = computed(() =>
  props.tiers?.toSorted((a, b) => parseInt(a.amount) - parseInt(b.amount))
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
