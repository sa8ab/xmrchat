import { getCachedCoins } from "../utils/getCachedCoins";

export default defineEventHandler(async (event) => {
  const { coins, swapMinMax } = await getCachedCoins(event);

  return { coins, swapMinMax };
});
