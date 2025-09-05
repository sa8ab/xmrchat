<script setup lang="ts">
const props = defineProps<{
  language?: string;
}>();

const { locales } = useI18n();

const locale = computed(() => {
  return locales.value.find((l) => l.code === props.language);
});
</script>

<template>
  <div class="flex items-center gap-2">
    <img :src="`/images/flags/${locale?.code}.png`" class="w-4 h-4" />
    <span>{{ locale?.name }}</span>
  </div>
</template>
