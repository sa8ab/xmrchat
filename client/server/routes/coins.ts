import { getCachedCoins } from "../utils/getCachedCoins";

export default defineEventHandler(async (event) => {
  const coins = await getCachedCoins(event);

  return coins;
});
