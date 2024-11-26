<template>
  <NuxtLayout name="default">
    <div class="flex-1 grid lg:grid-cols-12 gap-4 inner">
      <div class="lg:col-span-3">
        <StreamerMenu />
      </div>
      <div class="lg:col-span-9 py-4">
        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss"></style>
