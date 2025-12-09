<script setup lang="ts">
import type { SuperDm } from "~/types";

const { axios } = useApp();
const route = useRoute();

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

const hideSuperDmList = computed<boolean | undefined>(
  () => route.meta.hideSuperDmList as boolean
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
        <div v-else :class="['grid grid-cols-1 md:grid-cols-[250px_1fr]']">
          <div
            :class="[
              'md:border-e md:border-border md:pe-2',
              { 'hidden md:block': hideSuperDmList },
            ]"
          >
            <div class="flex flex-col gap-1">
              <SuperDmItem v-for="item in data.superDms" :superDm="item" />
            </div>
          </div>

          <div class="">
            <NuxtPage />
          </div>
        </div>
      </template>
    </PendingView>
  </div>
</template>
