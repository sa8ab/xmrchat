<script setup lang="ts">
import type { Tip } from "~/types";

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
  interval.value = setInterval(() => refresh(), 10000);
};

const stopTipsInterval = () => {
  clearInterval(interval.value);
};

onBeforeUnmount(() => stopTipsInterval());
</script>

<template>
  <div class="w-full sidebar scrollbar scrollbar-thumb-rose-500">
    <h3 class="font-medium text-xl pb-4">Recent Tips</h3>
    <!-- <UProgress
      v-if="pending && !data"
      animation="carousel"
      class="max-w-[280px] m-auto"
    />
    <div v-if="error">Something went wrong</div>
    <slot v-else /> -->
    <PendingView :error="error">
      <div class="empty text-pale" v-if="!data?.length">
        <UIcon name="i-heroicons-moon" class="empty-icon"></UIcon>
        <span class="empty-text">No recent tips!</span>
      </div>
      <template v-else>
        <div class="messages">
          <div class="item" v-for="item in data">
            <p class="pb-1 text-base font-medium">{{ item.name }}</p>
            <span class="flex pb-1 font-medium text-primary">
              {{ item.amount }} XMR
            </span>
            <p>
              {{ item.message }}
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
    @apply border-border border rounded-md flex flex-col gap-2 max-h-[400px] overflow-auto;
    .item {
      @apply p-3;
    }
  }
}
</style>
