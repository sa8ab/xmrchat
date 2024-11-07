<script lang="ts" setup>
const { toIndex, toStreamerCreate } = useRouteLocation();

const props = withDefaults(
  defineProps<{
    error?: any;
    defaultMessage?: string;
  }>(),
  {
    defaultMessage: "Something went wrong!",
  }
);
const renderMessage = computed(() => {
  if (!props.error) return props.defaultMessage;
  return getErrorMessage(props.error);
});
</script>

<template>
  <div class="error">
    <div class="message text-center py-10">
      <p class="pb-4 text-xl">{{ renderMessage }}</p>
      <div class="flex gap-3 justify-center">
        <UButton :to="toIndex()">Back to Home</UButton>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.error {
  @apply flex flex-col justify-center items-center;
}
</style>
