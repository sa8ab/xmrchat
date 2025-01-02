<script lang="ts" setup>
interface Props {
  title?: string;
  expiresAt?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cancel: [];
}>();
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-bold text-base">{{ title }}</h2>
    </template>
    <slot />
    <div class="flex justify-end pt-3">
      <UButton variant="outline" @click="emit('cancel')">Cancel</UButton>
    </div>
  </UCard>
</template>

<style scoped lang="scss">
.qr-code {
  @apply w-[300px] h-[300px] bg-gray-800;
}
</style>
