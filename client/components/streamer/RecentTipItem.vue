<script setup lang="ts">
import type { _backgroundColor } from "#tailwind-config/theme";
import type { Tip } from "~/types";

const props = defineProps<{
  item: Tip;
  disappearText?: string;
  computedPrice?: string;
  message?: string;
}>();

const { getPageTierColor } = useConstants();

const tier = computed(() => props.item.pageTipTier);
const tierColor = computed(() => tier.value?.color);

const itemStyle = computed(() => {
  if (!tierColor.value) return undefined;
  return {
    color: getForegroundColor(tierColor.value),
  };
});

const headingStyle = computed(() => {
  if (!tierColor.value) return undefined;
  return {
    backgroundColor: getPageTierColor(tierColor.value)?.headerColor,
    padding: "8px",
    borderRadius: "6px 6px 0 0",
  };
});

const messageStyle = computed(() => {
  if (!tierColor.value) return undefined;
  return {
    backgroundColor: tierColor.value,
    padding: "8px",
    borderRadius: "0 0 6px 6px",
  };
});

const amountClass = computed(() => {
  return tierColor.value ? "" : "text-primary";
});
</script>

<template>
  <div class="px-3">
    <div :style="['overflow-wrap: break-word rounded-md', itemStyle]">
      <div :style="headingStyle">
        <div class="flex justify-between items-center">
          <p
            class="pb-1 text-base font-medium"
            :class="{ 'text-pale': item.private }"
          >
            {{ item.private ? $t("private.title") : item.name }}
          </p>
          <UTooltip
            v-if="disappearText"
            :popper="{ placement: 'top' }"
            :text="disappearText"
          >
            <UIcon name="i-heroicons-clock" class="text-pale" />
          </UTooltip>
        </div>
        <span :class="['flex pb-1 font-medium ', amountClass]">
          {{ computedPrice }}
        </span>
      </div>

      <div :style="messageStyle">
        <p v-if="item.private" :class="'text-pale'">
          {{ $t("tipPrivateMessage") }}
        </p>
        <div v-else v-html="message" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
