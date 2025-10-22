<script lang="ts" setup>
import type { Numberic, ObsTipSocketEvent, StreamerPage, Tip } from "~/types";
import { FiatEnum, TipDisplayMode } from "~/types/enums";

const props = withDefaults(
  defineProps<{
    slug: string;
    tipValue?: TipDisplayMode;
    fiat?: FiatEnum;
    page?: StreamerPage;
    showPrivateNameAndMessage?: boolean;
  }>(),
  {
    showPrivateNameAndMessage: true,
  }
);

const { getTips: getTipsApi, updateTipPrivate: updatePrivateApi } =
  useServices();

const tipEvents = ref<ObsTipSocketEvent[]>([]);

const { init, disconnect, sendTipToObs, removeTipFromObs } = usePageSocket({
  handleInitialObsTipsEvent: (payloads) => {
    tipEvents.value = payloads;
  },
});

const { t } = useI18n();
const { relativeDate, dayjs } = useDate();

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
    label: "OBS",
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

    await refresh();
  } catch (error) {
    toast.add({
      title: t("error"),
      description: getErrorMessage(error),
      color: "red",
    });
  }
};

const { xmrToFiat } = useXmrPrice();
const { money } = useMoney();

const getComputedPrice = (amount?: string) => {
  const xmr = unitsToXmr(amount);
  const fiat = xmrToFiat(xmr, props.fiat);
  return props.tipValue === TipDisplayMode.XMR
    ? `${xmr} XMR`
    : money(fiat.toFixed(2), props.fiat);
};

const { getDisappearText } = useTip({
  page: computed(() => props.page),
});

const handleSendClick = async (row: Tip) => {
  try {
    await sendTipToObs(props.slug, row.id);
    tipEvents.value.push({ tip: row, message: "", autoRemove: false });
  } catch (error) {
    toast.add({
      title: t("error"),
      description: getErrorMessage(error),
      color: "red",
    });
  }
};

const handleRemoveClick = async (row: Tip) => {
  try {
    await removeTipFromObs(props.slug, row.id);
    tipEvents.value = tipEvents.value.filter(({ tip }) => tip?.id !== row.id);
  } catch (error) {
    toast.add({
      title: t("error"),
      description: getErrorMessage(error),
      color: "red",
    });
  }
};

const { markdownAndSanitize } = useMarkdown();

const makePublicAbility = computed(() => props.page?.ability?.makeTipPublic);
const getPrivateDisabled = (privateValue: boolean) =>
  privateValue && !makePublicAbility.value;
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
        <div class="flex flex-col text-xs">
          <span class="flex items-center gap-1">
            <span>
              {{ new Date(row.payment.paidAt).toLocaleDateString() }}
            </span>
            <UTooltip
              v-if="getDisappearText(row.createdAt)"
              :popper="{ placement: 'top' }"
              :text="getDisappearText(row.createdAt)"
            >
              <UIcon name="i-heroicons-clock" class="text-pale" />
            </UTooltip>
          </span>
          <span>{{ new Date(row.payment.paidAt).toLocaleTimeString() }}</span>
        </div>
      </template>

      <template #name-data="{ row }">
        <div v-if="row.private && !showPrivateNameAndMessage">
          <p class="text-pale">{{ t("private.title") }}</p>
        </div>
        <div v-else>
          {{ row.name }}
        </div>
      </template>
      <template #message-data="{ row }">
        <div v-if="row.private && !showPrivateNameAndMessage">
          <p class="text-pale">{{ t("tipPrivateMessage") }}</p>
        </div>
        <div
          v-else
          class="break-words max-w-[20rem] min-w-[8rem]"
          v-html="markdownAndSanitize(row?.message)"
        />
      </template>
      <template #private-data="{ row }">
        <div class="private">
          <UCheckbox
            :disabled="getPrivateDisabled(row.private)"
            :modelValue="row.private"
            @change="updateTipPrivate(row.id, $event)"
          ></UCheckbox>
        </div>
      </template>
      <template #actions-data="{ row }">
        <div class="flex">
          <UButton
            v-if="!tipEvents.find(({ tip }) => tip?.id === row.id)"
            variant="ghost"
            @click="handleSendClick(row)"
          >
            {{ t("show") }}
          </UButton>
          <UButton
            v-else
            variant="ghost"
            color="red"
            @click="handleRemoveClick(row)"
          >
            {{ t("hide") }}
          </UButton>
        </div>
      </template>
      <template #empty-state>
        <NoItems :text="t('noItems')" />
      </template>
    </UTable>
  </PendingView>
</template>

<style scoped></style>
