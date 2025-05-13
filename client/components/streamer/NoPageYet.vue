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
    <h6>{{ $t("youDontHavePage") }}</h6>
    <p>{{ $t("getStartedByCreatingPage") }}</p>
    <UButton size="xl" :to="toStreamerCreate()">
      {{ $t("createNewPage") }}
    </UButton>
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
