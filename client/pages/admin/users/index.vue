<script lang="ts" setup>
import type { User } from "~/types";

const route = useRoute();
const { $axios } = useNuxtApp();

const { page, offset, limit } = useFilter({
  initialPage: parseInt(route.query.page as string) || 1,
  getAll: () => refresh(),
  limit: 2,
});

const { data, error, pending, refresh } = useLazyAsyncData(
  async () => {
    const { data } = await $axios.get<{ users: User[]; total: number }>(
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
    key: "createdAt",
    label: "Created At",
  },
];
</script>

<template>
  <pre>{{ data }}</pre>
</template>

<style scoped></style>
