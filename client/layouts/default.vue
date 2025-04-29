<template>
  <div class="default-layout">
    <AppHeader />
    <main class="content flex flex-col">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.default-layout {
  @apply flex flex-col min-h-screen bg-background;
  .content {
    @apply flex-grow;
  }
}
</style>
