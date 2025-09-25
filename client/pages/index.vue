<script lang="ts" setup>
useHead({});
</script>

<template>
  <div class="inner">
    <HomeHero />
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-8">
      <HomeFAQ />
      <LiveStreams class="row-start-1 lg:row-start-auto" />
    </div>
  </div>
</template>

<style scoped></style>
