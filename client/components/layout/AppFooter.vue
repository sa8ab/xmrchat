<script setup lang="ts">
const { socials } = useAppConfig();
</script>

<template>
  <footer class="relative mt-10 border-t border-border">
    <div class="inner flex justify-center flex-col items-center py-8">
      <span class="text-sm text-pale">2024 @ XMRChat</span>
      <div class="social flex gap-2 mt-3">
        <UButton
          variant="ghost"
          color="white"
          square
          :to="`mailto:${socials.email}`"
          target="_blank"
        >
          <UIcon name="i-mdi-email" class="text-xl"></UIcon>
          <span class="sr-only">Contact via email</span>
        </UButton>
        <UButton
          variant="ghost"
          color="white"
          square
          :to="`https://twitter.com/${socials.twitter}`"
          target="_blank"
        >
          <UIcon name="i-mdi-twitter" class="text-xl"></UIcon>
          <span class="sr-only">Follow us on X</span>
        </UButton>
      </div>
    </div>
    <!-- <div
      class="gradient-bar w-full h-1 absolute bg-gradient-to-r from-primary-400 to-primary-600 bottom-0"
    ></div> -->
  </footer>
</template>

<style scoped lang="scss">
.gradient-bar {
  background: linear-gradient(to left);
}
</style>
