<script setup lang="ts">
import type { ContentLink } from "~/types";

const props = withDefaults(
  defineProps<{
    links?: ContentLink[];
    size?: number | string;
    tooltip?: boolean;
  }>(),
  {
    size: 20,
    tooltip: true,
  }
);

const { getContentLink } = useConstants();

const verifiedLinks = computed(() =>
  props.links?.filter((l) => l.verification)
);
const verifiedLinkNames = computed(() =>
  verifiedLinks.value?.map((l) => getContentLink(l.platform)?.name)
);
const verified = computed(() => verifiedLinks.value?.length);
</script>

<template>
  <template v-if="verified">
    <UTooltip :disabled="!tooltip">
      <UIcon
        name="i-heroicons-check-badge-20-solid"
        class="text-blue-500"
        :size="size"
      />

      <template #text>
        <div class="font-medium">
          Verified links: {{ verifiedLinkNames?.join(", ") }}
        </div>
      </template>
    </UTooltip>
  </template>
</template>

<style scoped></style>
