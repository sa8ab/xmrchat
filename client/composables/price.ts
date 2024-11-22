interface Options {
  pageMinXmr?: Ref<string | undefined>;
}

export const useXmrPrice = ({ pageMinXmr }: Options = {}) => {
  const { getPrice: getPriceApi } = useServices();
  const { minXMRPayAmount } = useAppConfig();

  const price = ref<number | undefined>(undefined);

  const getPrice = async () => {
    price.value = await getPriceApi();
    return price.value;
  };

  const minXmr = computed(() => {
    return pageMinXmr?.value ? parseFloat(pageMinXmr.value) : minXMRPayAmount;
  });

  const minUsdAmount = computed(() => {
    if (!price.value) return 0;
    return (Math.ceil(minXmr.value * price.value * 100) / 100).toFixed(2);
  });

  onMounted(() => {
    getPrice();
  });

  return {
    price,
    minUsdAmount,
    getPrice,
  };
};
