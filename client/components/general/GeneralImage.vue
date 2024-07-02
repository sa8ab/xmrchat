<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    id?: string;
    variant?: "logo" | "banner";
  }>(),
  {
    variant: "banner",
  }
);

const config = useRuntimeConfig();
</script>

<template>
  <img
    v-if="id"
    :src="`${config.public.apiBaseUrl}/v1/images/${id}`"
    :class="['general-image', `general-image-${variant}`]"
  />
</template>

<style scoped lang="scss">
.general-image {
  @apply rounded-lg border-2 border-border object-cover;
  &-logo {
    @apply rounded-full;
  }
  &-banner {
    aspect-ratio: 3 / 1;
  }
}
</style>
