<script lang="ts" setup>
import type { Numberic } from "~/types";

const props = withDefaults(
  defineProps<{
    url?: string;
    skipBaseUrl?: boolean;
    variant?: "logo" | "banner";
  }>(),
  {
    variant: "banner",
  }
);

const config = useRuntimeConfig();
const baseUrl = computed(() => {
  return props.skipBaseUrl ? "" : config.public.imageBaseUrl;
});
</script>

<template>
  <img
    v-if="url"
    :src="`${baseUrl}${url}`"
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
