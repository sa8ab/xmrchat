<script setup lang="ts">
import type { StreamerPage } from "~/types";
import { FiatEnum, TipDisplayMode } from "~/types/enums";

const props = defineProps<{
  slug: string;
  page?: StreamerPage | null;
}>();

const { getTips: getTipsApi } = useServices();
const { state: generalState } = useGeneralStore();
const { relativeDate, dayjs } = useDate();

const { xmrToFiat } = useXmrPrice();
const { money } = useMoney();
const { t } = useI18n();

const { data, refresh, pending, error } = useLazyAsyncData(
  `recent-tips-${props.slug}`,
  () => getTipsApi(props.slug),
  { server: false }
);

const interval = ref<NodeJS.Timeout | undefined>(undefined);

onMounted(() => startTipsInterval());
onBeforeUnmount(() => stopTipsInterval());

const startTipsInterval = () => {
  stopTipsInterval();
  interval.value = setInterval(() => refresh(), 10000);
};

const stopTipsInterval = () => {
  clearInterval(interval.value);
};

const getComputedPrice = (amount?: string) => {
  const xmr = unitsToXmr(amount);
  const fiat = xmrToFiat(xmr, props.page?.fiat);
  return generalState.tipDisplayValue === TipDisplayMode.XMR
    ? `${xmr} XMR`
    : money(fiat.toFixed(2), props.page?.fiat);
};

const generateLink = (url: string) => {
  let redirectURL = url;
  if (
    !url.startsWith('https') ||
    !url.startsWith('http') 
  ) {
    redirectURL = 'https://' + url;
  }
  return `
    <a
      class="text-primary hover:text-primary-400 hover:underline hover:underline-offset-4 hover:decoration-primary-400" 
      href="${redirectURL}" 
      target="_blank" 
     >
      ${url}
     </a>
  `;
}

const checkUrlOnMessage = (message: string): string => {
  const urlRegex = /\b\n?(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{1,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+~#?&\/\/=]*)/gm;
  const updatedMessage = message.replace(urlRegex, generateLink);
  return updatedMessage;
};

const formattedMessage = (message: string) => {
  if (!message) return message;
  const generatedMessage = checkUrlOnMessage(message);
  return generatedMessage;
};

const { getFiat } = useConstants();
const { getDisappearText } = useTip({
  page: computed(() => props.page),
});
</script>

<template>
  <div class="sidebar scrollbar">
    <div class="flex justify-between gap-2 items-center pb-2">
      <h3 class="font-medium text-lg">
        {{ t("recentTips") }}
      </h3>
      <UTooltip
        :text="
          t('tipDisplayValueTooltip', {
            fiat: getFiat(page?.fiat || FiatEnum.USD).name,
          })
        "
        :popper="{ placement: 'top' }"
      >
        <TipValueToggle
          v-model="generalState.tipDisplayValue"
          :fiat="page?.fiat"
        />
      </UTooltip>
    </div>
    <PendingView :error="error">
      <div v-if="pending && !data" class="">
        <div class="flex flex-col gap-3 border-border border rounded-md p-3">
          <div v-for="x in 2" class="flex flex-col gap-2">
            <USkeleton class="h-4 w-[100px]" />
            <USkeleton class="h-4 w-[60px]" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-[100px]" />
          </div>
        </div>
      </div>
      <div class="empty text-pale" v-else-if="!data?.length">
        <UIcon name="i-heroicons-moon" class="empty-icon"></UIcon>
        <span class="empty-text">{{ t("noRecentTips") }}</span>
      </div>
      <template v-else>
        <div class="messages">
          <div class="item" v-for="item in data">
            <div class="flex justify-between items-center">
              <p
                class="pb-1 text-base font-medium"
                :class="{ 'text-pale': item.private }"
              >
                {{ item.private ? t("private.title") : item.name }}
              </p>
              <UTooltip
                v-if="getDisappearText(item.createdAt)"
                :popper="{ placement: 'top' }"
                :text="getDisappearText(item.createdAt)"
              >
                <UIcon name="i-heroicons-clock" class="text-pale" />
              </UTooltip>
            </div>
            <span class="flex pb-1 font-medium text-primary">
              {{ getComputedPrice(item.payment?.amount) }}
            </span>
            <p
              v-if="item.private"
              class="text-pale"
              >
              {{ t("private.title") }}
            </p>
            <p
              v-else
              v-html="formattedMessage(item.message)"
           />
          </div>
        </div>
      </template>
    </PendingView>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  .empty {
    @apply p-6 border-border border flex items-center flex-col rounded-md;
    .empty-icon {
      @apply text-3xl;
    }
    .empty-text {
      @apply text-sm mt-1;
    }
  }
  .messages {
    @apply py-3 border-border border rounded-md flex flex-col gap-4 max-h-[400px] overflow-auto;
    .item {
      @apply px-3;

      overflow-wrap: break-word;
    }
  }
}
</style>
