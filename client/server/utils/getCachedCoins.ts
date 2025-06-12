import { H3Event } from "h3";
import { Coin } from "~/types";

export const getCachedCoins = defineCachedFunction(
  async (event: H3Event) => {
    const config = useRuntimeConfig(event);

    const res = await $fetch<{ coins: Coin[] }>(
      `${
        config.public.apiServerSideBaseUrl || config.public.apiBaseUrl
      }/swaps/coins`
    );

    const swapRes = await $fetch<{ minimum: number; maximum: number }>(
      `${
        config.public.apiServerSideBaseUrl || config.public.apiBaseUrl
      }/swaps/min-swap`
    );

    return {
      coins: res.coins,
      swapMinMax: swapRes,
    };
  },
  {
    maxAge: 60 * 40, // 40 minutes
    swr: true,
    getKey: () => `swap-coins-and-swap-min-max`,
  }
);
