import { H3Event } from "h3";
import type { Prices } from "~/types";

export const getCachedPrices = defineCachedFunction(
  async (event: H3Event) => {
    const config = useRuntimeConfig(event);

    const prices = await $fetch<{ xmr: Prices }>(
      `${config.public.apiServerSideBaseUrl || config.public.apiBaseUrl}/prices`
    );

    return prices;
  },
  {
    maxAge: 60 * 4,
    swr: true,
    getKey: () => `prices`,
  }
);
