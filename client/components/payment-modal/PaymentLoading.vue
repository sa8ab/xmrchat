<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    showLoading?: boolean;
    text?: string;
  }>(),
  {
    showLoading: true,
  }
);

const { t } = useI18n();

const translatedText = computed(() => props.text || t("waitingForPayment"));
</script>

<template>
  <div class="flex justify-center items-center gap-2">
    <UIcon
      class="animate-spin w-[18px] h-[18px]"
      name="i-heroicons-arrow-path-20-solid"
      v-if="showLoading"
    />
    <span class="text-sm">{{ translatedText }}</span>
  </div>
</template>

<style scoped></style>
