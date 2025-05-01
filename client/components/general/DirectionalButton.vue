<script setup lang="ts">
const { direction } = useDirection();

const props = defineProps<{
  size?: "lg" | "md" | "sm";
  direction?: "forward" | "backward";
  text?: string;
  type?: "button" | "submit";
}>();

const arrowIcon = computed(() => {
  if (props.direction === "forward") {
    return direction.value === "rtl"
      ? "i-heroicons-arrow-small-left"
      : "i-heroicons-arrow-small-right";
  } else if (props.direction === "backward") {
    return direction.value === "ltr"
      ? "i-heroicons-arrow-small-right"
      : "i-heroicons-arrow-small-left";
  }
});
</script>

<template>
  <div>
    <div :class="`flex gap-3`">
      <UButton v-bind="props" :trailingIcon="arrowIcon">
        {{ props.text }}
        <slot />
      </UButton>
    </div>
  </div>
</template>
