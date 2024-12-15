export default defineNuxtPlugin(async () => {
  const price = useState("xmrPrice");

  await useAsyncData(async () => {
    price.value = await $fetch("/get-price");
    return {};
  });
});
