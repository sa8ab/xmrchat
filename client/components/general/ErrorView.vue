<script lang="ts" setup>
const { toIndex, toStreamerCreate } = useRouteLocation();

const props = withDefaults(
  defineProps<{
    error?: any;
    defaultMessage?: string;
    showBackToHome?: boolean;
  }>(),
  {
    defaultMessage: "Something went wrong!",
    showBackToHome: true,
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
      <div v-if="showBackToHome" class="flex gap-3 justify-center">
        <UButton :to="toIndex()">{{ $t("backToHome") }}</UButton>
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
