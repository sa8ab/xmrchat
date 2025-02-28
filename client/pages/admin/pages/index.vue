<script lang="ts" setup>
import type { StreamerPage } from "~/types";

const route = useRoute();

const { $axios } = useNuxtApp();

const { page, offset, limit } = useFilter({
  initialPage: parseInt(route.query.page as string) || 1,
  getAll: () => refresh(),
});

const { data, error, pending, refresh } = useLazyAsyncData(
  async () => {
    const { data } = await $axios.get<{ pages: StreamerPage[]; total: number }>(
      "/admin/pages",
      {
        params: {
          limit,
          offset: offset.value,
          search: route.query.search,
        },
      }
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
  <PageTitle title="Pages"></PageTitle>
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
        <div class="flex flex-col">
          <span> {{ row.path }} </span>
          <span v-if="!row.isPublic" class="text-xs text-pale">Private</span>
        </div>
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
      <template #action-data="{ row }">
        <UButton trailingIcon="i-heroicons-arrow-long-right" variant="ghost">
          View
        </UButton>
      </template>
      <template #empty-state>
        <NoItems />
      </template>
    </UTable>

    <UPagination
      v-if="data?.total"
      v-model="page"
      :total="data.total"
      :pageCount="limit"
      class="mt-12 justify-center"
    />
  </PendingView>
</template>

<style scoped></style>
