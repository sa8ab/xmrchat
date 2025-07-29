<script setup lang="ts">
import type { NuxtError } from "#app";
const localeRoute = useLocaleRoute();

const props = defineProps({
  error: Object as () => NuxtError,
});

defineOgImage(false);
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background">
    <AppHeader />
    <div
      class="grid grid-cols-1 sm:grid-cols-2 flex-grow inner py-16 sm:py-0 items-center justify-center"
    >
      <div
        class="text-text items-center sm:items-start row-start-2 sm:row-start-1 flex flex-col gap-2 mx-auto w-fit"
      >
        <h2 class="text-3xl md:text-6xl lg:text-8xl font-extralight">
          {{ error?.statusCode }}
        </h2>
        <h1
          class="text-center break-all sm:text-start text-2xl lg:text-3xl font-bold"
        >
          {{ error?.message }}
        </h1>
        <UButton
          :to="localeRoute('/')"
          class="text-lg sm:text-xl mt-8 sm:mt-10"
        >
          <span>Go Home</span>
        </UButton>
      </div>

      <div class="mx-auto">
        <img
          src="/images/notfound.svg"
          alt="404 Not Found"
          class="w-full h-full sm:max-w-full max-w-[250px] object-contain contrast-50"
        />
      </div>
    </div>
    <AppFooter />
  </div>
</template>
