<script lang="ts" setup>
const { socials } = useAppConfig();
</script>

<template>
  <div>
    <div class="title">
      <h5>Contact Us</h5>
    </div>
    <div class="socials">
      <div class="item">
        <UIcon name="i-heroicons-envelope-16-solid" class="icon"></UIcon>
        <div class="item-title">Email</div>
        <p>Email us directly</p>
        <UButton variant="outline" class="mt-3" :to="`mailto:${socials.email}`">
          {{ socials.email }}
        </UButton>
      </div>
      <div class="item">
        <UIcon name="i-mdi-twitter" class="icon"></UIcon>
        <div class="item-title">Twitter</div>
        <p>Follow us on Twitter</p>

        <UButton
          variant="outline"
          class="mt-3"
          :to="`https://twitter.com/${socials.twitter}`"
        >
          @{{ socials.twitter }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  @apply w-full py-14 flex items-center justify-center flex-col;
  h5 {
    @apply text-4xl font-bold;
  }
}
.socials {
  @apply flex justify-center;
  .item {
    @apply px-10 py-5 flex flex-col items-center gap-1;
    .icon {
      @apply text-5xl text-primary mb-4;
    }
    .item-title {
      @apply text-xl font-medium;
    }
    p {
      @apply text-center text-pale;
    }
  }
}
@media screen and (max-width: 600px) {
  .socials {
    @apply flex-col items-center;
  }
}
</style>
