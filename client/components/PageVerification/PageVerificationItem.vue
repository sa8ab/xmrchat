<script setup lang="ts">
import type { PageVerification } from "~/types";

const props = defineProps<{
  item: PageVerification;
}>();

const { getPageVerificationType } = useConstants();
</script>

<template>
  <div class="inline-flex flex-wrap gap-2">
    <div class="font-medium">
      {{ getPageVerificationType(item.type)?.name }}:
    </div>
    <div class="inline-flex gap-2">
      <UButton
        v-if="item.verifiedUrl"
        :to="item.verifiedUrl"
        :padded="false"
        variant="link"
        external
        target="_blank"
      >
        {{ item.name }}
      </UButton>
      <UButton
        :to="item.url"
        :padded="false"
        variant="link"
        color="gray"
        external
        target="_blank"
      >
        ( Verify )
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
