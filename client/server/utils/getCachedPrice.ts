import { H3Event } from "h3";

export const getCachedPrice = defineCachedFunction(
  async (event: H3Event) => {
    const config = useRuntimeConfig(event);

    const price = await $fetch<string | number>(
      `${
        config.public.apiServerSideBaseUrl || config.public.apiBaseUrl
      }/prices/xmr`
    );

    return price;
  },
  {
    maxAge: 60 * 4,
    swr: true,
    getKey: () => `xmr-price`,
  }
);
