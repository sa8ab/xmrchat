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
    maxAge: 60 * 60,
    swr: true,
  }
);
