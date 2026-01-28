import type { PageTipTier } from "~/types";
import { TipDisplayMode, type FiatEnum } from "~/types/enums";

interface IParams {
  amount?: MaybeRef<string>;
  price?: MaybeRef<number>;
  pageTipTiers?: MaybeRef<PageTipTier[] | undefined>;
  tipDisplayValue?: MaybeRef<TipDisplayMode | undefined>;
}

export const useTipMessageLength = (params?: IParams) => {

  const xmrAmount = computed(() => {
    const amount = Number(unref(params?.amount));
    const price = unref(params?.price);
    const tipDisplayValue = unref(params?.tipDisplayValue);

    if (!amount || !price) return 0;

    if (tipDisplayValue === TipDisplayMode.XMR) {
      return amount;
    } else {
      return Number((amount / (price as number)).toFixed(8));
    }
  });

  const pageTierMessageLength = computed(() => {
    const pageTiers = unref(params?.pageTipTiers);
    if (!pageTiers?.length) return undefined;

    if (!xmrAmount.value) return undefined;

    const tiers = pageTiers
      .filter((tier) => {
        const minAmount = tier.minAmount ? tier.minAmount : 0;
        return xmrAmount.value >= minAmount;
      })
      .sort((a: PageTipTier, b: PageTipTier) => {
        const minAmountA = a.minAmount ? a.minAmount : 0;
        const minAmountB = b.minAmount ? b.minAmount : 0;
        return minAmountB - minAmountA;
      });

    if (!tiers.length) return undefined;


    const firstTier = tiers[0];
    if (!firstTier) return undefined;


    return firstTier.messageLength;
  });


  return {
    pageTierMessageLength,
  };
};