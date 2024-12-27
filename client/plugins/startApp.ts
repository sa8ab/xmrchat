export default defineNuxtPlugin(async () => {
  const price = useState("xmrPrice");
  const coins = useState("coins");
  const minSwap = useState("minSwap");
  const swapActive = useState("swapActive");

  await useAsyncData(async () => {
    price.value = await $fetch("/get-price");

    const res = await $fetch("/coins");
    coins.value = res.coins;
    minSwap.value = res.swapMinMax.minimum;
    swapActive.value = res.active;

    return {};
  });
});
