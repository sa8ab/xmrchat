<script setup lang="ts">
import type { PaidContent } from "~/types";

const {
  toStreamerPaidContentCreate,
  toStreamerPaidContentEdit,
  toStreamerPaidContentSettings,
} = useRouteLocation();
const { t } = useI18n();
const { axios } = useApp();

const { data, pending, error } = useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ paidContent: PaidContent[] }>(
      `/paid-content`,
    );
    return data.paidContent;
  },
  {
    server: false,
  },
);

const columns = computed(() => [
  {
    key: "name",
    label: t("name"),
  },
  {
    key: "duration",
    label: "Duration",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "actions",
  },
]);
</script>

<template>
  <div>
    <PageTitle title="Paid Content" description="Manage your paid content" />

    <div class="flex justify-end mb-4 gap-2 flex-wrap">
      <UButton :to="toStreamerPaidContentCreate()">Create Paid Content</UButton>
      <UButton :to="toStreamerPaidContentSettings()" variant="soft">
        Settings
      </UButton>
    </div>

    <UTable
      :rows="data || []"
      :columns="columns"
      class="border border-border rounded-md"
      :ui="{
        td: { base: 'whitespace-normal text-text dark:text-text' },
      }"
    >
      <template #amount-data="{ row }">
        <span>{{ row.amount ? `${row.amount} XMR` : "-" }}</span>
      </template>
      <template #actions-data="{ row }">
        <div class="flex gap-2 justify-end">
          <UButton
            variant="ghost"
            color="primary"
            :to="toStreamerPaidContentEdit(row.id)"
          >
            {{ $t("edit") }}
          </UButton>
          <!-- <UButton
            variant="ghost"
            color="red"
          >
            {{ $t("delete") }}
          </UButton> -->
        </div>
      </template>
      <template #empty-state>
        <NoItems />
      </template>
    </UTable>
  </div>
</template>

<style scoped></style>
