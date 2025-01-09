import { getCachedCoins } from "../utils/getCachedCoins";
import { getCachedSwapStatus } from "../utils/getCachedSwapStatus";

export default defineEventHandler(async (event) => {
  const { coins, swapMinMax } = await getCachedCoins(event);
  const { active } = await getCachedSwapStatus(event);

  return { coins, swapMinMax, active };
});
