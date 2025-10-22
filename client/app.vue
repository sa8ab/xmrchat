<script setup lang="ts">
const { localeProperties } = useI18n();

const { t } = useI18n();
const lang = computed(() => localeProperties.value?.code);
const dir = computed(() => localeProperties.value?.dir);

const i18nHead = useLocaleHead();

useHead(() => ({
  titleTemplate: (title?: string) =>
    title ? `${title} | XMRChat` : t("moneroSuperchats"),
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang,
    dir,
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
}));

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
    <UModals />
  </div>
</template>

<style>
.app {
  @apply text-text;
}
</style>
