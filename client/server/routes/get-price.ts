import { getCachedPrice } from "../utils/getCachedPrice";

export default defineEventHandler(async (event) => {
  const price = await getCachedPrice(event);

  return parseFloat(price as string);
});
