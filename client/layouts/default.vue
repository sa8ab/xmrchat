<template>
  <div class="default-layout">
    <AppHeader />
    <main class="content">
      <slot />
    </main>
    <DevOnly>
      <UCheckbox
        v-model="devLoggedIn"
        class="fixed bottom-5 left-5 bg-background p-2 border border-border rounded-lg"
        label="Dev login"
      ></UCheckbox>
    </DevOnly>
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
const devLoggedIn = useCookie("xmrchat-dev-logged-in", {
  default: () => false,
  maxAge: 1000 * 1000,
});
</script>

<style scoped lang="scss">
.default-layout {
  @apply flex flex-col min-h-screen;
  .content {
    @apply flex-1;
  }
}
</style>
