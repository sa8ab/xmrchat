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

    return res.coins;
  },
  {
    maxAge: 60 * 60 * 4, // 4 Hours
    swr: true,
  }
);

export const getCachedSwapMin = defineCachedFunction(
  async (event: H3Event) => {
    const config = useRuntimeConfig(event);

    const res = await $fetch<{ minimum: number; maximum: number }>(
      `${
        config.public.apiServerSideBaseUrl || config.public.apiBaseUrl
      }/swaps/min-swap`
    );

    return res;
  },
  {
    maxAge: 60 * 60, // 1 Hour
    swr: true,
  }
);
