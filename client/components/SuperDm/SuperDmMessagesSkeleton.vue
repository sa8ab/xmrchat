<script setup lang="ts"></script>

<template>
  <div class="flex gap-2 py-2 px-4">
    <div class="flex flex-col flex-1 gap-1">
      <USkeleton class="h-4 w-[100px]" />
      <USkeleton class="h-3 w-[60px]" />
    </div>
    <div class="flex items-center justify-end">
      <USkeleton class="h-8 w-24" />
    </div>
  </div>
  <div class="p-6 flex flex-col gap-4">
    <div
      v-for="x in 2"
      :class="['flex', x % 2 === 0 ? 'justify-start' : 'justify-end']"
    >
      <USkeleton class="h-20 w-[300px]" />
    </div>
  </div>
</template>

<style scoped></style>
