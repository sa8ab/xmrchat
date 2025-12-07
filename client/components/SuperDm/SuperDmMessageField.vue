<script setup lang="ts">
const model = defineModel<string | undefined>();
</script>

<template>
  <div class="flex gap-2 p-4 border-t border-border">
    <UInput
      v-model="model"
      placeholder="Send a message..."
      class="flex-grow"
      size="lg"
    />
    <UButton size="lg" icon="heroicons:paper-airplane-20-solid" square>
    </UButton>
  </div>
</template>

<style scoped></style>
