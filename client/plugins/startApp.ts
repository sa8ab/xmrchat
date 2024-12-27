export default defineNuxtPlugin(async () => {
  const price = useState("xmrPrice");
  const coins = useState("coins");
  const minSwap = useState("minSwap");

  await useAsyncData(async () => {
    price.value = await $fetch("/get-price");

    const { coins: coinsRes, minSwap: minSwapRes } = await $fetch("/coins");
    coins.value = coinsRes;
    minSwap.value = minSwapRes.minimum;

    return {};
  });
});
