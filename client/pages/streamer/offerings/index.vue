<script setup lang="ts">
import type { Offering } from "~/types";

const { toCreateStreamerOffering } = useRouteLocation();

const { axios } = useApp();

const { data, pending, error } = useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ offerings: Offering[] }>(`/offerings`);
    return data.offerings;
  },
  {
    server: false,
  },
);
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
