import { H3Event } from "h3";

export const getCachedPrice = defineCachedFunction(
  async (event: H3Event) => {
    const config = useRuntimeConfig(event);

    const price = await $fetch(
      `${config.public.apiServerSideBaseUrl}/prices/xmr`
    );

    return price;
  },
  {
    maxAge: 60 * 4,
    swr: true,
  }
);
