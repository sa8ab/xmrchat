<script lang="ts" setup>
import type { StreamerPage } from "~/types";

const { $axios } = useNuxtApp();

const { data, error, pending } = useLazyAsyncData(
  async () => {
    const { data } = await $axios.get<{ pages: StreamerPage[]; total: number }>(
      "/admin/pages"
    );
    return data;
  },
  {
    server: false,
  }
);

const columns = [
  {
    key: "path",
    label: "Path",
  },
  {
    key: "user",
    label: "User",
  },
  {
    key: "tips",
    label: "Total paid amount",
  },
  {
    key: "count",
    label: "Paid tips count",
  },
  {
    key: "action",
    label: "",
  },
];
</script>

<template>
  <PageTitle title="All Pages"></PageTitle>
  <PendingView :error="error" :pending="pending && !data">
    <UTable
      v-if="data"
      :rows="data.pages"
      :columns="columns"
      class="border border-border rounded-md"
      :ui="{
        td: { base: 'whitespace-normal text-text dark:text-text' },
      }"
    >
      <template #path-data="{ row }">
        {{ row.path }}
      </template>
      <template #user-data="{ row }">
        <div class="flex flex-col">
          <span>{{ row.user?.email }}</span>
          <span class="text-xs text-pale">{{
            new Date(row.user?.createdAt).toLocaleString()
          }}</span>
        </div>
      </template>
      <template #tips-data="{ row }">
        <div class="flex flex-col">
          <span>{{ row.totalTips }} XMR</span>
        </div>
      </template>
      <template #count-data="{ row }">
        <div class="flex flex-col">
          <span>{{ row.tipsCount }} Tips</span>
        </div>
      </template>
      <template #empty-state>
        <NoItems />
      </template>
    </UTable>
  </PendingView>
</template>

<style scoped></style>
