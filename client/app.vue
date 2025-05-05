<script setup lang="ts">
const { direction } = useDirection();

useHead(() => {
  return {
    titleTemplate: (title) =>
      title ? `${title} | XMRChat` : "Monero Superchats : XMRChat",
  };
});

useAppSeoMeta();
</script>

<template>
  <div class="app" :dir="direction">
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
