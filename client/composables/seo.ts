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
    twitterImage: "/images/xmrchat-banner.png",
  });
};

export const useStreamerIdSeoMeta = (
  page: Ref<StreamerPage | undefined | null>
) => {
  useSeoMeta({
    title: () => `Tip ${page.value?.path || ""}`,
  });

  useServerSeoMeta({
    ogTitle: `XMRChat - Tip ${page.value?.path} with Monero`,
    twitterTitle: `XMRChat - Tip ${page.value?.path} with Monero`,
  });
};
