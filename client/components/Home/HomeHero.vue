<script lang="ts" setup>
const { toStreamerDisplay, toCreators } = useRouteLocation();
</script>

<template>
  <div class="home-hero">
    <div class="image-side">
      <img
        class="w-full rounded-md overflow-hidden border-border border-2"
        src="/images/home-hero-3.png"
        alt=""
      />
    </div>
    <div class="content-side">
      <h1 class="font-bold text-6xl">XMRChat</h1>
      <p class="description">Tip your favorite streamer in cryptocurrency.</p>
      <div class="flex gap-2 flex-wrap">
        <UButton size="xl" :to="toStreamerDisplay()">
          Creators Start Here
        </UButton>
        <UButton size="xl" :to="toCreators()" variant="outline">
          Find Creators
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-hero {
  @apply flex flex-row items-center mt-8;

  .image-side {
    @apply flex-1 flex py-3 p-10;
  }

  .content-side {
    @apply flex-1  flex flex-col p-10;
    .description {
      @apply text-lg pt-4 pb-6;
    }
  }

  @media only screen and (max-width: 840px) {
    @apply flex-col items-stretch;
    .image-side {
      @apply flex-1 flex py-3 p-1;
    }
    .content-side {
      @apply p-1;
    }
  }
}
</style>
