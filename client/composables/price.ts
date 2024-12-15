interface Options {
  pageMinXmr?: Ref<string | undefined>;
}

export const useXmrPrice = ({ pageMinXmr }: Options = {}) => {
  const { minXMRPayAmount } = useAppConfig();

  const price = useState<number | undefined>("xmrPrice");

  const minXmr = computed(() => {
    return pageMinXmr?.value ? parseFloat(pageMinXmr.value) : minXMRPayAmount;
  });

  const minUsdAmount = computed(() => {
    if (!price.value) return 0;
    return (Math.ceil(minXmr.value * price.value * 100) / 100).toFixed(2);
  });

  return {
    price,
    minUsdAmount,
  };
};
