<script setup lang="ts">
import type { SuperDm } from "~/types";

const { axios } = useApp();
const route = useRoute();
const { toStreamerSuperDmSettings } = useRouteLocation();

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
const hideSuperDmLayout = computed<boolean | undefined>(
  () => route.meta.hideSuperDmLayout as boolean
);
</script>

<template>
  <div>
    <PageTitle
      title="Super DMs"
      description="Manage your Super DMs"
    ></PageTitle>

    <div class="flex justify-end mb-6" v-if="!hideSuperDmLayout">
      <UButton :to="toStreamerSuperDmSettings()" variant="soft">
        Super DMs Settings
      </UButton>
    </div>

    <NuxtPage v-if="hideSuperDmLayout" />

    <div v-else :class="['grid grid-cols-1 md:grid-cols-[250px_1fr]']">
      <div
        :class="[
          'md:border-e md:border-border md:pe-2',
          { 'hidden md:block': hideSuperDmList },
        ]"
      >
        <div class="flex flex-col gap-1">
          <template v-if="pending">
            <SuperDmItemSkeleton v-for="x in 4" />
          </template>
          <template v-else>
            <SuperDmItem v-for="item in data?.superDms" :superDm="item" />
          </template>
        </div>
      </div>

      <div class="">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
