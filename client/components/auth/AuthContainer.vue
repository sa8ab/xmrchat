<script lang="ts" setup>
const props = defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<template>
  <div class="auth-container">
    <div class="box">
      <h2 class="title">{{ title }}</h2>
      <p class="pb-8 text-pale" v-if="description">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-container {
  @apply flex items-center justify-center w-full min-h-[600px];
}
.box {
  @apply w-full max-w-[450px] border border-border p-6 rounded-md bg-background;
}
.title {
  @apply text-3xl font-bold pb-4;
}
</style>
