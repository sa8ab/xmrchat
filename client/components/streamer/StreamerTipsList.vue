<script lang="ts" setup>
import type { Numberic } from "~/types";
import { SupportedDisplayCurrency } from "~/types/enums";

const props = defineProps<{
  slug: string;
  tipValue?: SupportedDisplayCurrency;
}>();

const { getTips: getTipsApi, updateTipPrivate: updatePrivateApi } =
  useServices();

const { errorHandler } = useErrorHandler();

const toast = useToast();

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
  {
    key: "private",
    label: "Private",
  },
  // {
  //   key: "actions",
  // },
];

const updateTipPrivate = async (id: Numberic, isPrivate: boolean) => {
  try {
    await updatePrivateApi(id, {
      private: isPrivate,
    });

    toast.add({
      title: "Tip updated!",
    });

    refresh();
  } catch (error) {
    errorHandler(error);
  }
};

const { price } = useXmrPrice();

const getComputedPrice = (amount?: string) => {
  const xmr = unitsToXmr(amount);
  const usd = (xmr || 0) * (price.value || 0);
  return props.tipValue === SupportedDisplayCurrency.XMR
    ? `${xmr} XMR`
    : `$${usd.toFixed(2)}`;
};
</script>

<template>
  <PendingView :error="error" :pending="pending && !data">
    <UTable
      v-if="data"
      :rows="data"
      :columns="columns"
      class="border border-border rounded-md"
      :ui="{
        td: { base: 'whitespace-normal text-text dark:text-text' },
      }"
    >
      <template #amount-data="{ row }">
        {{ getComputedPrice(row.payment.amount) }}
      </template>
      <template #paidAt-data="{ row }">
        <div class="paid-at">
          {{ new Date(row.payment.paidAt).toLocaleString() }}
        </div>
      </template>
      <template #message-data="{ row }">
        <div class="break-words max-w-[20rem] min-w-[8rem]">
          {{ row.message }}
        </div>
      </template>
      <template #private-data="{ row }">
        <div class="private">
          <UCheckbox
            :modelValue="row.private"
            @change="updateTipPrivate(row.id, $event)"
          ></UCheckbox>
        </div>
      </template>
      <template #empty-state>
        <NoItems />
      </template>
    </UTable>
  </PendingView>
</template>

<style scoped></style>
