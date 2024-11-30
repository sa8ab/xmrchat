<script setup lang="ts">
definePageMeta({
  middleware: ["logged-in"],
  layout: "streamer",
});
</script>

<template>
  <NuxtPage />
</template>
