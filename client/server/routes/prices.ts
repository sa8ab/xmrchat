import { getCachedPrices } from "../utils/getCachedPrices";

export default defineEventHandler(async (event) => {
  return getCachedPrices(event);
});
