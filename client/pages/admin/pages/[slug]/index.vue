<script lang="ts" setup>
import type { StreamerPage } from "~/types";

const { $axios } = useNuxtApp();
const route = useRoute();
const { toStreamer } = useRouteLocation();
const { data, error, pending, refresh } = useLazyAsyncData(
  `admin-page-${route.params.slug}`,
  async () => {
    const { data } = await $axios.get<{ page: StreamerPage }>(
      `/admin/pages/${route.params.slug}`
    );
    return data.page;
  },
  {
    server: false,
  }
);
</script>

<template>
  <PendingView :error="error" :pending="pending && !data">
    <div v-if="data">
      <PageTitle
        :title="`Page ${data?.path}`"
        :description="data.user?.email"
      ></PageTitle>

      <div class="flex gap-1 justify-end mb-4">
        <UButton :to="toStreamer(route.params.slug as string)">
          Visit Page
        </UButton>
        <UButton color="red" icon="i-heroicons-trash"> Delete </UButton>
        <UButton color="red" icon="i-heroicons-no-symbol" variant="outline">
          Deactivate
        </UButton>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <UCard :ui="{ background: 'dark:bg-background-2' }">
          <template #header>
            <h2 class="text-lg">Page Info</h2>
          </template>
          <div class="grid grid-cols-2 gap-2">
            <div class="text-pale">Tips Count</div>
            <div>{{ data.tipsCount }}</div>
            <div class="text-pale">Total paid amount</div>
            <div>{{ data.totalTips }} XMR</div>
            <div class="text-pale">Status</div>
            <div>Not implemented yet</div>
            <div class="text-pale">Public page</div>
            <div>{{ data.isPublic ? "Yes" : "No" }}</div>
          </div>
        </UCard>
        <UCard :ui="{ background: 'dark:bg-background-2' }">
          <template #header>
            <h2 class="text-lg">Details</h2>
          </template>
          <div class="flex flex-col gap-2 pb-4">
            <div class="text-pale">Primary Address</div>
            <div>
              <CopyInput :text="data.primaryAddress" />
            </div>
            <div class="text-pale">Secret View Key</div>
            <div>
              <CopyInput :text="data.secretViewKey" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="text-pale">Twitch</div>
            <div>{{ data.twitchChannel || "-" }}</div>
            <div class="text-pale">Min tip amount</div>
            <div>{{ data.minTipAmount }} XMR</div>
            <div class="text-pale">Default tip amount display</div>
            <div>{{ data.defaultTipAmountDisplay?.toUpperCase() }}</div>
          </div>
        </UCard>
        <!-- <UCard :ui="{ background: 'dark:bg-background-2' }">
          <template #header> Tiers </template>
          content
        </UCard> -->
      </div>
    </div>
  </PendingView>
</template>

<style scoped></style>
