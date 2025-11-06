<script setup lang="ts">
const { toCreateStreamerPageTier } = useRouteLocation();
const { axios } = useApp();

const { data, pending, error } = useLazyAsyncData(
  async () => {
    const { data } = await axios.get(`/page-tip-tiers`);
  },
  {
    server: false,
  }
);
</script>

<template>
  <div>
    <PageTitle title="Tip tiers" description="Manage your tip tiers" />
    <div class="flex justify-end mb-4">
      <UButton :to="toCreateStreamerPageTier()">Create Tier</UButton>
    </div>
  </div>
</template>

<style scoped></style>
