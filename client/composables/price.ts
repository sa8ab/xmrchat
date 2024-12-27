interface Options {
  pageMinXmr?: Ref<string | undefined>;
}

export const useXmrPrice = ({ pageMinXmr }: Options = {}) => {
  const { minXMRPayAmount } = useAppConfig();

  const price = useState<number | undefined>("xmrPrice");
  const minSwapState = useState<string | undefined>("minSwap");

  const minXmr = computed(() => {
    return pageMinXmr?.value ? parseFloat(pageMinXmr.value) : minXMRPayAmount;
  });

  const minSwapXMR = computed(() =>
    minSwapState.value ? parseFloat(minSwapState.value) : 0.055
  );

  const minUsdAmount = computed(() => {
    if (!price.value) return 0;
    return (Math.ceil(minXmr.value * price.value * 100) / 100).toFixed(2);
  });

  const minSwapUSD = computed(() => {
    if (!price.value) return 0;
    return (Math.ceil(minSwapXMR.value * price.value * 100) / 100).toFixed(2);
  });

  return {
    price,
    minUsdAmount,
    minSwapUSD,
  };
};
