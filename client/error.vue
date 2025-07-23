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
      class="grid grid-cols-1 sm:grid-cols-2 flex-grow inner py-4 items-center justify-center"
    >
      <div
        class="text-text items-center sm:items-start flex flex-col gap-2 mx-auto w-fit"
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

      <div>
        <img
          src="/images/notfound.svg"
          alt="404 Not Found"
          class="w-full h-full object-contain contrast-50"
        />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.box {
  width: 140px;
  height: auto;
  float: left;
  transition: 0.5s linear;
  position: relative;
  display: block;
  overflow: hidden;
  padding: 15px;
  text-align: center;
  margin: 0 5px;
  background: transparent;
  text-transform: uppercase;
  font-weight: 900;
}

.box:before {
  position: absolute;
  content: "";
  left: 0;
  bottom: 0;
  height: 4px;
  width: 100%;
  border-bottom: 4px solid transparent;
  border-left: 4px solid transparent;
  box-sizing: border-box;
  transform: translateX(100%);
}

.box:after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-top: 4px solid transparent;
  border-right: 4px solid transparent;
  box-sizing: border-box;
  transform: translateX(-100%);
}

.box:hover:before {
  @apply border-primary;
  height: 100%;
  transform: translateX(0);
  transition: 0.3s transform linear, 0.3s height linear 0.3s;
}

.box:hover:after {
  @apply border-primary;
  height: 100%;
  transform: translateX(0);
  transition: 0.3s transform linear, 0.3s height linear 0.5s;
}

.btn {
  text-decoration: none;
  cursor: pointer;
  outline: none;
  border: none;
  background: transparent;
  width: fit-content;
}
</style>
