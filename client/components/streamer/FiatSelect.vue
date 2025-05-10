<script lang="ts" setup>
import { FiatEnum } from "~/types/enums";

const model = defineModel<FiatEnum>();

const { getFiat } = useConstants();

const options = computed(() => {
  return Object.values(FiatEnum).map((v) => ({
    name: getFiat(v).name,
    code: v,
  }));
});
</script>

<template>
  <USelectMenu
    v-model="model"
    :options="options"
    valueAttribute="code"
    optionAttribute="name"
  />
</template>

<style scoped></style>
