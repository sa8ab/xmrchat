<script setup lang="ts">
const { localeProperties } = useI18n();

const { t } = useI18n();
const lang = computed(() => localeProperties.value?.code);
const dir = computed(() => localeProperties.value?.dir);

useHead({
  titleTemplate: (title?: string) =>
    title ? `${title} | XMRChat` : t("moneroSuperchats"),
  htmlAttrs: {
    lang,
    dir,
  },
});

useAppSeoMeta();
defineOgImage({
  component: "XMRChat",
  props: {
    title: "XMRChat",
  },
});
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
