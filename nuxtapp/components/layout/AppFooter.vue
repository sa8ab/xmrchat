<script setup lang="ts">
const { socials } = useAppConfig();
</script>

<template>
  <footer class="my-10">
    <div class="inner flex justify-center flex-col items-center">
      <span class="text-sm text-pale">2024 @ XMRChat</span>
      <div class="social flex gap-2 mt-3">
        <UButton
          variant="ghost"
          color="white"
          square
          :to="`mailto:${socials.email}`"
          target="_blank"
        >
          <UIcon name="i-mdi-email text-xl"></UIcon>
          <span class="sr-only">Contact via email</span>
        </UButton>
        <UButton
          variant="ghost"
          color="white"
          square
          :to="`https://twitter.com/${socials.twitter}`"
          target="_blank"
        >
          <UIcon name="i-mdi-twitter text-xl"></UIcon>
          <span class="sr-only">Follow us on X</span>
        </UButton>
      </div>
    </div>
  </footer>
</template>
