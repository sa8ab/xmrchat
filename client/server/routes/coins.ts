import { getCachedCoins, getCachedSwapMin } from "../utils/getCachedCoins";

export default defineEventHandler(async (event) => {
  const coins = await getCachedCoins(event);
  const minSwap = await getCachedSwapMin(event);

  return { coins, minSwap };
});
