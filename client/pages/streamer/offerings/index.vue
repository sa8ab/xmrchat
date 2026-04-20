<script setup lang="ts">
const { toCreateStreamerOffering } = useRouteLocation();
</script>

<template>
  <div>
    <PageTitle title="Offerings" description="Manage your offerings" />

    <div class="flex justify-end mb-4">
      <UButton :to="toCreateStreamerOffering()">Create Offering</UButton>
    </div>
  </div>
</template>

<style scoped></style>
