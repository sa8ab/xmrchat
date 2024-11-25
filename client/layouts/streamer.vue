<template>
  <NuxtLayout name="default">
    <div class="grid grid-cols-12 inner">
      <div class="col-span-3">
        <StreamerMenu />
      </div>
      <div class="col-span-9">
        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss"></style>
