<script setup lang="ts">
const { toStreamerRecipients } = useRouteLocation();
</script>

<template>
  <UAlert color="red" variant="subtle">
    <template #title>
      <h2 class="text-lg font-medium">
        This feature is available for premium streamers only.
      </h2>
    </template>
    <!-- <template #description>
      <p>
        To enable this feature set the percentage of XMRChat tip split to 3% or
        more in
        <UButton
          variant="link"
          :to="toStreamerRecipients()"
          :padded="false"
          class="underline"
        >
          tip splits
        </UButton>
        page.
      </p>
    </template> -->
  </UAlert>
</template>

<style scoped></style>
