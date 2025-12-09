<script setup lang="ts">
import type { SuperDm } from "~/types";

const { axios } = useApp();

const { data, error, pending } = await useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{
      superDms: SuperDm[];
      settingsConfigured: boolean;
    }>("/super-dms");

    return data;
  },
  {
    server: false,
  }
);
</script>

<template>
  <div>
    <PageTitle
      title="Super DMs"
      description="Manage your Super DMs"
    ></PageTitle>

    <PendingView :pending="pending" :error="error">
      <template v-if="data">
        <SuperDmDisabled v-if="!data?.settingsConfigured" />
        <div v-else class="grid grid-cols-[250px_1fr]">
          <div class="border-e border-border pe-2">
            <div class="flex flex-col gap-1">
              <SuperDmItem v-for="item in data.superDms" :superDm="item" />
            </div>
          </div>
          <NuxtPage />
        </div>
      </template>
    </PendingView>
  </div>
</template>
