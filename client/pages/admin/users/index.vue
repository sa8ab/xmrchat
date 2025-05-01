<script lang="ts" setup>
import type { User } from "~/types";

const route = useRoute();
const { $axios } = useNuxtApp();
const { t } = useI18n();

const { page, offset, limit } = useFilter({
  initialPage: parseInt(route.query.page as string) || 1,
  getAll: () => refresh(),
});

const { data, error, pending, refresh } = useLazyAsyncData(
  async () => {
    const { data } = await $axios.get<{ users: User[]; count: number }>(
      "/admin/users",
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
    key: "email",
    label: "Email",
  },
  {
    key: "created-at",
    label: "Created At",
  },
];
</script>

<template>
  <PageTitle title="Users"></PageTitle>

  <PendingView :error="error" :pending="pending && !data">
    <UTable
      v-if="data"
      :rows="data.users"
      :columns="columns"
      class="border border-border rounded-md"
      :ui="{
        td: { base: 'whitespace-normal text-text dark:text-text' },
      }"
    >
      <template #created-at-data="{ row }">
        <span>{{ new Date(row.createdAt).toLocaleString() }}</span>
      </template>
      <template #action-data="{ row }">
        <UButton trailingIcon="i-heroicons-arrow-long-right" variant="ghost">
          View
        </UButton>
      </template>
      <template #empty-state>
        <NoItems :text="t('noItems')" />
      </template>
    </UTable>

    <UPagination
      v-if="data?.count"
      v-model="page"
      :total="data.count"
      :pageCount="limit"
      class="mt-12 justify-center"
    />
  </PendingView>
</template>

<style scoped></style>
