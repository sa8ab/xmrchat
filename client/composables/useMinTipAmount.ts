import type { Prices } from "~/types";
import { FiatEnum } from "~/types/enums";

interface Options {
  pageMinXmr?: Ref<string | undefined>;
  pageFiat?: Ref<FiatEnum | undefined>;
}

export const useMinTipAmount = ({ pageMinXmr, pageFiat }: Options = {}) => {
  const { minXMRPayAmount } = useAppConfig();
  const { xmrToFiat, prices } = useXmrPrice();

  const minSwapState = useState<string | undefined>("minSwap");

  const price = computed(() => {
    return prices.value[pageFiat?.value ?? FiatEnum.USD];
  });

  const minXmr = computed(() => {
    return pageMinXmr?.value ? parseFloat(pageMinXmr.value) : minXMRPayAmount;
  });

  const minSwapXMR = computed(() =>
    minSwapState.value ? parseFloat(minSwapState.value) : 0.055
  );

  const minUsdAmount = computed(() => {
    if (!price.value) return "0";
    return (Math.ceil(minXmr.value * price.value * 100) / 100).toFixed(2);
  });

  const minSwapUSD = computed(() => {
    if (!price.value) return 0;
    const swapMin = (
      Math.ceil(minSwapXMR.value * price.value * 100) / 100
    ).toFixed(2);
    return Math.max(parseFloat(swapMin), parseFloat(minUsdAmount.value));
  });

  return {
    price,
    minUsdAmount,
    minSwapUSD,
  };
};
