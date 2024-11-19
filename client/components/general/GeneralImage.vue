<script lang="ts" setup>
import type { Numberic } from "~/types";

const props = withDefaults(
  defineProps<{
    url?: string;
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
    v-if="url"
    :src="`${config.public.imageBaseUrl}${url}`"
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
