<script setup lang="ts">
const props = defineProps<{
  title: String;
  desciption?: String;
  icon?: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center text-center py-8">
    <div class="flex items-center gap-2">
      <UIcon v-if="icon" :name="icon" class="w-[24px] h-[24px]" />
      <h2 class="font-medium text-2xl">{{ title }}</h2>
    </div>
    <p class="text-pale">{{ desciption }}</p>
  </div>
</template>

<style scoped lang="scss"></style>
