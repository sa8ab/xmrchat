<script lang="ts" setup>
import type { Numberic, Tip } from "~/types";
import { SupportedDisplayCurrency } from "~/types/enums";

const props = defineProps<{
  slug: string;
  tipValue?: SupportedDisplayCurrency;
}>();

const { getTips: getTipsApi, updateTipPrivate: updatePrivateApi } =
  useServices();

const { init, disconnect, sendTipToObs, removeTipFromObs } = usePageSocket({});

const { errorHandler } = useErrorHandler();
const { t } = useI18n();

const toast = useToast();

const { data, refresh, pending, error } = useLazyAsyncData(
  `recent-tips-${props.slug}`,
  () => getTipsApi(props.slug)
);
const interval = ref<NodeJS.Timeout | undefined>(undefined);

onMounted(() => {
  startTipsInterval();
  init(props.slug);
});
onUnmounted(() => disconnect());

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
    label: t("tipName"),
  },
  {
    key: "amount",
    label: t("tipAmount"),
  },
  {
    key: "message",
    label: t("tipMessage"),
  },
  {
    key: "paidAt",
    label: t("tipDate"),
  },
  {
    key: "private",
    label: t("tipPrivate"),
  },
  {
    key: "actions",
  },
];

const updateTipPrivate = async (id: Numberic, isPrivate: boolean) => {
  try {
    await updatePrivateApi(id, {
      private: isPrivate,
    });

    toast.add({
      title: t("tipUpdated"),
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

const handleSendClick = async (row: Tip) => {
  try {
    await sendTipToObs(props.slug, row.id);
  } catch (error) {
    errorHandler(error);
  }
};

const handleRemoveClick = async (row: Tip) => {
  try {
    await removeTipFromObs(props.slug, row.id);
  } catch (error) {
    errorHandler(error);
  }
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
      <template #actions-data="{ row }">
        <div class="flex">
          <UButton variant="ghost" @click="handleSendClick(row)">
            <UIcon name="i-heroicons-arrow-right-16-solid" size="18" />
            Send to OBS
          </UButton>
          <UButton variant="ghost" @click="handleRemoveClick(row)">
            Remove from obs
          </UButton>
        </div>
      </template>
      <template #empty-state>
        <NoItems />
      </template>
    </UTable>
  </PendingView>
</template>

<style scoped></style>
