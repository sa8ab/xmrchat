<script setup lang="ts">
const { localeProperties } = useI18n();

const lang = computed(() => localeProperties.value?.code);
const dir = computed(() => localeProperties.value?.dir);

useHead({
  titleTemplate: (title?: string) =>
    title ? `${title} | XMRChat` : "Monero Superchats : XMRChat",
  htmlAttrs: {
    lang,
    dir,
  },
});

useAppSeoMeta();
</script>

<template>
  <div class="app" :locale="localeProperties">
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
