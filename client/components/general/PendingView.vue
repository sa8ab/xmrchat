<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    error?: any;
    pending?: boolean | null;
    showBackToHome?: boolean;
  }>(),
  {
    showBackToHome: true,
  }
);
</script>

<template>
  <UProgress v-if="pending" animation="carousel" class="max-w-[280px] m-auto" />
  <ErrorView
    :error="error"
    v-if="error"
    :defaultMessage="$t('somethingWentWrong')"
    :showBackToHome="showBackToHome"
  />
  <slot v-else />
</template>

<style scoped lang="scss"></style>
