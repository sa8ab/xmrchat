<script setup lang="ts">
import type { NotificationPreference } from "~/types";

const { axios } = useApp();

const state = reactive({});

await useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ preferences: NotificationPreference[] }>(
      `/notification-preferences`
    );

    return data;
  },
  { server: false }
);
</script>

<template>
  <div>
    <PageTitle
      title="Notification Preferences"
      description="Manage your notification preferences"
    />
  </div>
</template>

<style scoped></style>
