import type { StreamerPage } from "~/types";

export const useAppSeoMeta = () => {
  const description =
    "Viewers, send messages and tips with ease and privacy. Streamers, keep nearly all of your tips instead of giving 30-50% to big tech.";
  const title = "Message and Tip with Monero";
  useServerSeoMeta({
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: "/images/xmrchat-banner.png",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: "https://xmrchat.com/images/xmrchat-banner.png",
    twitterCard: "summary_large_image",
  });
};

export const useStreamerIdSeoMeta = (
  page: Ref<StreamerPage | undefined | null>
) => {
  const {
    public: { imageBaseUrl },
  } = useRuntimeConfig();
  useSeoMeta({
    title: () => `Tip ${page.value?.path || ""}`,
  });

  useServerSeoMeta({
    ogTitle: `XMRChat - Tip ${page.value?.path} with Monero`,
    twitterTitle: `XMRChat - Tip ${page.value?.path} with Monero`,
    twitterCard: "summary",
    twitterImage: `${imageBaseUrl}${page.value?.logo.url}`,
    ogImage: `${imageBaseUrl}${page.value?.logo.url}`,
  });
};
