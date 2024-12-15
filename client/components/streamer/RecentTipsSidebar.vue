<script setup lang="ts">
import type { StreamerPage } from "~/types";
import { SupportedDisplayCurrency } from "~/types/enums";

const props = defineProps<{
  slug: string;
  page?: StreamerPage | null;
}>();

const { getTips: getTipsApi } = useServices();
const { state: generalState } = useGeneralStore();

const { price } = useXmrPrice();

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

const modelValue = computed({
  set: (v) => {
    generalState.tipDisplayValue = v
      ? SupportedDisplayCurrency.XMR
      : SupportedDisplayCurrency.USD;
  },
  get: () => generalState.tipDisplayValue === SupportedDisplayCurrency.XMR,
});

const getComputedPrice = (amount?: string) => {
  const xmr = unitsToXmr(amount);
  const usd = (xmr || 0) * (price.value || 0);
  return generalState.tipDisplayValue === SupportedDisplayCurrency.XMR
    ? `${xmr} XMR`
    : `$${usd.toFixed(2)}`;
};
</script>

<template>
  <div class="sidebar scrollbar">
    <div class="flex justify-between gap-2 items-center pb-2">
      <h3 class="font-medium text-lg">Recent Tips</h3>
      <UTooltip
        text="Show tip values in XMR or USD"
        :popper="{ placement: 'top' }"
      >
        <div class="toggle flex items-center gap-1">
          <span class="text-xs">USD</span>
          <UToggle
            v-model="modelValue"
            :ui="{ inactive: 'bg-primary', active: 'bg-primary' }"
          />
          <span class="text-xs">XMR</span>
        </div>
      </UTooltip>
    </div>
    <!-- <UProgress
      v-if="pending && !data"
      animation="carousel"
      class="max-w-[280px] m-auto"
    />
    <div v-if="error">Something went wrong</div>
    <slot v-else /> -->
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
        <span class="empty-text">No recent tips!</span>
      </div>
      <template v-else>
        <div class="messages">
          <div class="item" v-for="item in data">
            <p
              class="pb-1 text-base font-medium"
              :class="{ 'text-pale': item.private }"
            >
              {{ item.private ? "Private" : item.name }}
            </p>
            <span class="flex pb-1 font-medium text-primary">
              {{ getComputedPrice(item.payment?.amount) }}
            </span>
            <p :class="{ 'text-pale': item.private }">
              {{ item.private ? "Private" : item.message }}
            </p>
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
