import { H3Event } from "h3";

export const getCachedCoins = defineCachedFunction(
  async (event: H3Event) => {
    const config = useRuntimeConfig(event);

    const coins = await $fetch(
      `${
        config.public.apiServerSideBaseUrl || config.public.apiBaseUrl
      }/swaps/coins`
    );

    return coins;
  },
  {
    maxAge: 60 * 60,
    swr: true,
  }
);
