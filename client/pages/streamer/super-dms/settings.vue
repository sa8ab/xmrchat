<script setup lang="ts">
definePageMeta({
  hideSuperDmLayout: true,
});
</script>

<template>
  <div>
    <PageTitle
      title="Super DM Settings"
      description="Configure your Super DM settings"
    ></PageTitle>

    <SuperDmSettings />

    <UDivider class="my-6" />

    <SuperDmKeysSetting class="col-span-full" />
  </div>
</template>

<style scoped></style>
