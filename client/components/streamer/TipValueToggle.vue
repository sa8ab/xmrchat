<script lang="ts" setup>
import { SupportedDisplayCurrency } from "~/types/enums";

const model = defineModel<SupportedDisplayCurrency | undefined>();

const computedModel = computed({
  set: (v) => {
    model.value = v
      ? SupportedDisplayCurrency.XMR
      : SupportedDisplayCurrency.USD;
  },
  get: () => model.value === SupportedDisplayCurrency.XMR,
});
</script>

<template>
  <div class="toggle flex items-center gap-1">
    <span class="text-xs">USD</span>
    <UToggle
      v-model="computedModel"
      :ui="{ inactive: 'bg-primary', active: 'bg-primary' }"
    />
    <span class="text-xs">XMR</span>
  </div>
</template>

<style scoped></style>
