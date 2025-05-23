<script setup lang="ts">
const model = defineModel<number | string>({
  set: (v) => {
    if (v === "never") return null;
    return v;
  },
  get: (v) => {
    if (!v) return "never";
    return v;
  },
});

const { t } = useI18n();

const options = computed(() => {
  return [
    { label: t("never"), value: "never" },
    { label: t("xDays", { count: 1 }), value: 1440 },
    { label: t("xMonths", { count: 1 }), value: 43200 },
    { label: t("xMonths", { count: 3 }), value: 129600 },
  ];
});
</script>

<template>
  <USelectMenu
    v-model="model"
    :options="options"
    valueAttribute="value"
    optionAttribute="label"
  />
</template>
