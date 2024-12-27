export default defineNuxtPlugin(async () => {
  const price = useState("xmrPrice");
  const coins = useState("coins");
  const minSwap = useState("minSwap");

  await useAsyncData(async () => {
    price.value = await $fetch("/get-price");

    const res = await $fetch("/coins");
    coins.value = res.coins;
    minSwap.value = res.swapMinMax.minimum;

    return {};
  });
});
