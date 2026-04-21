<script setup lang="ts">
import type { PaidContent } from "~/types";

const { toStreamerPaidContentCreate } = useRouteLocation();

const { axios } = useApp();

const { data, pending, error } = useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ paidContent: PaidContent[] }>(
      `/paid-content`,
    );
    return data.paidContent;
  },
  {
    server: false,
  },
);
</script>

<template>
  <div>
    <PageTitle title="Paid Content" description="Manage your paid content" />

    <div class="flex justify-end mb-4">
      <UButton :to="toStreamerPaidContentCreate()">Create Paid Content</UButton>
    </div>
  </div>
</template>

<style scoped></style>
