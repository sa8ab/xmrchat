<script setup lang="ts">
import type { PageTipTier } from "~/types";

const { toCreateStreamerPageTier, toEditStreamerPageTier } = useRouteLocation();
const { axios } = useApp();

const { data, pending, error } = useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ pageTipTiers: PageTipTier[] }>(
      `/page-tip-tiers`
    );
    return data.pageTipTiers;
  },
  {
    server: false,
  }
);

const columns = computed(() => [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "minAmount",
    label: "Min. ( XMR )",
  },
  {
    key: "color",
    label: "Color",
  },
  {
    key: "sound",
    label: "Sound",
  },
  {
    key: "actions",
  },
]);
</script>

<template>
  <div>
    <PageTitle title="Tip tiers" description="Manage your tip tiers" />
    <div class="flex justify-end mb-4">
      <UButton :to="toCreateStreamerPageTier()">Create Tier</UButton>
    </div>
    <UProgress
      v-if="pending"
      animation="carousel"
      class="max-w-[280px] m-auto mb-4"
    />
    <UTable
      :rows="data || []"
      :columns="columns"
      class="border border-border rounded-md"
      :ui="{
        td: { base: 'whitespace-normal text-text dark:text-text' },
      }"
    >
      <template #minAmount-data="{ row }">
        <span>{{ row.minAmount ? `${row.minAmount} XMR` : "-" }}</span>
      </template>
      <template #color-data="{ row }">
        <div
          v-if="row.color"
          class="w-6 h-6 rounded-full ring-2 ring-border"
          :style="{ backgroundColor: row.color }"
        ></div>
        <div v-else>-</div>
      </template>
      <template #sound-data="{ row }">
        <div class="max-w-[120px] truncate text-sm">
          <span v-if="row.sound">
            {{ row.sound.originalName }}
          </span>
          <span v-else>-</span>
        </div>
      </template>
      <template #actions-data="{ row }">
        <UButton
          variant="ghost"
          color="primary"
          :to="toEditStreamerPageTier(row.id)"
        >
          Edit
        </UButton>
      </template>
      <template #empty-state>
        <NoItems />
      </template>
    </UTable>
  </div>
</template>

<style scoped></style>
