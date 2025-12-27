<script setup lang="ts">
definePageMeta({
  hideSuperDmLayout: true,
});
</script>

<template>
  <div>
    <PageTitle
      title="SuperDM Settings"
      description="Configure your SuperDM settings"
    ></PageTitle>

    <SuperDmSettings />

    <UDivider class="my-6" />

    <SuperDmKeysSetting class="col-span-full" />
  </div>
</template>

<style scoped></style>
