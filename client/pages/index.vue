<script lang="ts" setup>
useHead({});
const { $axios } = useNuxtApp();
const sendRequest = async () => {
  const res = await $axios.post("/i18n-test", {
    count: 1,
  });
  console.log(res.data);
};
</script>

<template>
  <div class="inner">
    <UButton @click="sendRequest">Test</UButton>
    <HomeHero />
    <HomeFAQ />
  </div>
</template>

<style scoped></style>
