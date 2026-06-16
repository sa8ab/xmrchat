<script setup lang="ts">
const { toStreamerPaidContentSettings } = useRouteLocation();
</script>

<template>
  <div class="flex flex-col items-center mt-6">
    <h3 class="text-lg font-medium text-center inline-flex items-center gap-2">
      <UIcon name="i-heroicons-exclamation-triangle" size="22px" />
      <span> Paid content is not configured. </span>
    </h3>
    <p class="text-pale text-center pt-2">
      Some text to describe about paid content.
    </p>
    <div class="mt-4 flex gap-2 flex-wrap">
      <UButton :to="toStreamerPaidContentSettings()">
        Configure Paid Content
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
