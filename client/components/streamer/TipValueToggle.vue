<script lang="ts" setup>
import { FiatEnum, TipDisplayMode } from "~/types/enums";

const model = defineModel<TipDisplayMode | undefined>();
const props = defineProps<{
  fiat?: FiatEnum;
}>();

const computedModel = computed({
  set: (v) => {
    model.value = v ? TipDisplayMode.XMR : TipDisplayMode.FIAT;
  },
  get: () => model.value === TipDisplayMode.XMR,
});

const { getFiat } = useConstants();
</script>

<template>
  <div class="toggle flex items-center gap-1">
    <span class="text-xs">{{ getFiat(props.fiat || FiatEnum.USD).name }}</span>
    <UToggle
      v-model="computedModel"
      :ui="{ inactive: 'bg-primary', active: 'bg-primary' }"
    />
    <span class="text-xs">XMR</span>
  </div>
</template>

<style scoped></style>
