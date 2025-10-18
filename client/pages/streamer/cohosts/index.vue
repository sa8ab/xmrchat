<script setup lang="ts">
import type { User } from "~/types";

const { axios } = useApp();

const { data } = useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ cohosts: User[] }>("/cohosts");
    return data.cohosts;
  },
  { server: false }
);
</script>

<template>
  <div>
    <PageTitle title="Cohosts" description="Manage your cohosts" />
    <pre>{{ data }}</pre>
    <NoCohosts />
  </div>
</template>
