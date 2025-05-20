<script setup lang="ts">
import type { StreamerPage } from "~/types";
import { TipDisplayMode } from "~/types/enums";

const props = defineProps<{
  selectedCoin?: number;
  page?: StreamerPage | null;
}>();

const { state: generalState } = useGeneralStore();
const { minFiatAmount, price, minXmr, minSwapXMR, minSwapFiatAmount } =
  useMinTipAmount({
    pageMinXmr: computed(() => props.page?.minTipAmount),
    pageFiat: computed(() => props.page?.fiat),
  });

const { t } = useI18n();
const { money } = useMoney();

const isXmrDisplay = computed(
  () => generalState.tipDisplayValue === TipDisplayMode.XMR
);

const renderMin = computed(() => {
  if (isXmrDisplay.value) {
    return props.selectedCoin ? minSwapXMR.value : minXmr.value;
  }

  return props.selectedCoin ? minSwapFiatAmount.value : minFiatAmount.value;
});
</script>

<template>
  <span class="text-xs" v-if="selectedCoin">{{
    t("tipSwapMinimum", {
      min: isXmrDisplay ? `${renderMin} XMR` : money(renderMin, page?.fiat),
    })
  }}</span>
  <span class="text-xs" v-else>
    {{
      t("tipMinimum", {
        min: isXmrDisplay ? `${renderMin} XMR` : money(renderMin, page?.fiat),
      })
    }}</span
  >
</template>
