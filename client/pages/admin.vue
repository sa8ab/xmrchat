<script setup lang="ts">
definePageMeta({
  middleware: ["logged-in", "admin"],
  layout: "streamer",
});
</script>

<template>
  <NuxtPage />
</template>
