export default defineNuxtPlugin(async () => {
  const prices = useState("prices");
  const coins = useState("coins");
  const minSwap = useState("minSwap");
  const swapActive = useState("swapActive");

  await useAsyncData(async () => {
    const pricesRes = await $fetch("/prices");
    prices.value = pricesRes.xmr;

    const res = await $fetch("/coins");
    coins.value = res.coins;
    minSwap.value = res.swapMinMax.minimum;
    swapActive.value = res.active;

    return {};
  });
});
