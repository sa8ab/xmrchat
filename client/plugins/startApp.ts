export default defineNuxtPlugin(async () => {
  const price = useState("xmrPrice");
  const coins = useState("coins");

  await useAsyncData(async () => {
    price.value = await $fetch("/get-price");
    coins.value = await $fetch("/coins");
    return {};
  });
});
