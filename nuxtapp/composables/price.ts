export const useXmrPrice = () => {
  const { getPrice: getPriceApi } = useServices();
  const { minXMRPayAmount } = useAppConfig();

  const price = ref<number | undefined>(undefined);

  const getPrice = async () => {
    price.value = await getPriceApi();
    return price.value;
  };

  const minUsdAmount = computed(() => {
    if (!price.value) return 0;
    return (Math.ceil(minXMRPayAmount * price.value * 100) / 100).toFixed(2);
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
