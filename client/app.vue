<script setup lang="ts">
useHead(() => {
  return {
    titleTemplate: (title) =>
      title ? `${title} | XMRChat` : "Monero Superchats : XMRChat",
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
    <ConfirmModal />
  </div>
</template>

<style>
.app {
  @apply text-text;
}
</style>
