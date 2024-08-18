<script lang="ts" setup>
const props = defineProps<{
  slug: string;
}>();

const { getTips: getTipsApi } = useServices();

const { data, refresh, pending, error } = useLazyAsyncData(
  `recent-tips-${props.slug}`,
  () => getTipsApi(props.slug)
);
const interval = ref<NodeJS.Timeout | undefined>(undefined);

onMounted(() => startTipsInterval());

const startTipsInterval = () => {
  stopTipsInterval();
  interval.value = setInterval(() => refresh(), 8000);
};

const stopTipsInterval = () => {
  clearInterval(interval.value);
};

onBeforeUnmount(() => stopTipsInterval());

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "message",
    label: "Message",
  },
  {
    key: "paidAt",
    label: "Date",
  },
  // {
  //   key: "actions",
  // },
];
</script>

<template>
  <PendingView :error="error" :pending="pending && !data">
    <UTable
      v-if="data"
      :rows="data"
      :columns="columns"
      class="border border-border rounded-md"
      :ui="{
        td: { base: 'whitespace-normal' },
      }"
    >
      <template #paidAt-data="{ row }">
        <div class="paid-at">
          {{ new Date(row.paid_at).toLocaleString() }}
        </div>
      </template>
      <!-- <template #actions-data="{ row }">
        <UButton>Feature</UButton>
      </template> -->
      <template #empty-state>
        <NoItems />
      </template>
    </UTable>
  </PendingView>
</template>

<style scoped></style>
