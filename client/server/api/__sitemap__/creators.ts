// server/api/__sitemap__/urls.ts
import type { SitemapUrlInput } from "#sitemap/types";
import type { StreamerPage } from "~/types";

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig();
  const baseUrl =
    config.public.apiServerSideBaseUrl || config.public.apiBaseUrl;

  const response = await $fetch<{ pages: StreamerPage[] }>(
    `${baseUrl}/pages/sitemap`
  );
  const creators = response.pages;

  return creators.map((creator) => ({
    loc: `/${creator.path}`,
    _i18nTransform: true,
  })) satisfies SitemapUrlInput[];
});
