<script setup lang="ts">
useHead(() => {
  return {
    titleTemplate: (title) => (title ? `${title} | XMRChat` : "XMRChat"),
  };
});

useAppSeoMeta();
</script>

<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<style>
.app {
  @apply text-text bg-background;
}
</style>
