<script setup lang="ts">
const { localeProperties } = useI18n();

const props = withDefaults(
  defineProps<{
    direction?: "forward" | "backward";
    type?: "arrow" | "chevron";
  }>(),
  {
    type: "arrow",
    direction: "forward",
  }
);

const arrowIcon = computed(() => {
  if (localeProperties.value.dir === "rtl") {
    return props.direction === "forward"
      ? "i-heroicons-arrow-small-left"
      : "i-heroicons-arrow-small-right";
  } else {
    return props.direction === "forward"
      ? "i-heroicons-arrow-small-right"
      : "i-heroicons-arrow-small-left";
  }
});

const chevronIcon = computed(() => {
  if (localeProperties.value.dir === "rtl") {
    return props.direction === "forward"
      ? "i-heroicons-chevron-left-20-solid"
      : "i-heroicons-chevron-right-20-solid";
  } else {
    return props.direction === "forward"
      ? "i-heroicons-chevron-right-20-solid"
      : "i-heroicons-chevron-left-20-solid";
  }
});

const icon = computed(() => {
  return props.type === "arrow" ? arrowIcon.value : chevronIcon.value;
});
</script>

<template>
  <UIcon :name="icon" class="w-5 h-5"></UIcon>
</template>
