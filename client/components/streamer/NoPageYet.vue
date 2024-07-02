<script setup lang="ts">
const { toStreamerCreate } = useRouteLocation();
</script>
<template>
  <div class="no-page">
    <img
      class="w-full rounded-md overflow-hidden"
      src="/images/home-hero.png"
      alt=""
    />
    <h6>You don't have a page yet</h6>
    <p>Get started by creating a new page for yourself</p>
    <UButton size="xl" :to="toStreamerCreate()">Create New Page</UButton>
  </div>
</template>
<style scoped lang="scss">
.no-page {
  @apply w-full py-5 flex justify-center items-center flex-col text-center;
  img {
    @apply w-[400px];
  }
  h6 {
    @apply text-3xl md:text-5xl font-medium py-6;
  }
  p {
    @apply text-lg md:text-xl text-gray-600 mb-10;
  }
}
</style>
