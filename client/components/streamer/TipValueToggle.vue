<script lang="ts" setup>
import { TipDisplayMode } from "~/types/enums";

const model = defineModel<TipDisplayMode | undefined>();

const computedModel = computed({
  set: (v) => {
    model.value = v ? TipDisplayMode.XMR : TipDisplayMode.FIAT;
  },
  get: () => model.value === TipDisplayMode.XMR,
});
</script>

<template>
  <div class="toggle flex items-center gap-1">
    <span class="text-xs">Fiat</span>
    <UToggle
      v-model="computedModel"
      :ui="{ inactive: 'bg-primary', active: 'bg-primary' }"
    />
    <span class="text-xs">XMR</span>
  </div>
</template>

<style scoped></style>
