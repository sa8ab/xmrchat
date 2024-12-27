import { H3Event } from "h3";

export const getCachedSwapStatus = defineCachedFunction(
  async (event: H3Event) => {
    const config = useRuntimeConfig(event);

    const res = await $fetch<{
      active: boolean;
    }>(
      `${
        config.public.apiServerSideBaseUrl || config.public.apiBaseUrl
      }/swaps/status`
    );
    return {
      active: res.active,
    };
  },
  {
    maxAge: 60 * 1, // 1 Minute
    swr: true,
    getKey: () => `swap-status`,
  }
);
