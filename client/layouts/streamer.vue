<template>
  <NuxtLayout name="default">
    <div class="flex-1 lg:grid lg:grid-cols-12 lg:gap-6 inner">
      <div class="lg:col-span-3">
        <MenuContainer>
          <StreamerMenuContent />
        </MenuContainer>
      </div>
      <div class="lg:col-span-9 py-4">
        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss"></style>
