<script setup lang="ts">
const props = defineProps<{
  title: String;
  desciption?: String;
}>();
</script>

<template>
  <div class="text-center py-10">
    <h2 class="font-medium text-2xl">{{ title }}</h2>
    <p class="text-pale">{{ desciption }}</p>
  </div>
</template>

<style scoped lang="scss"></style>
