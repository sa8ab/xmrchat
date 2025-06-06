import type { StreamerPage } from "~/types";

export const useAppSeoMeta = () => {
  const { t } = useI18n();

  const description = t("head.description");

  const title = t("head.title");
  useServerSeoMeta({
    description,
    ogTitle: title,
    ogDescription: description,
    // ogImage: "/images/xmrchat-banner.png",
    twitterTitle: title,
    twitterDescription: description,
    // twitterImage: "https://xmrchat.com/images/xmrchat-banner.png",
    // twitterCard: "summary_large_image",
  });
};

export const useStreamerIdSeoMeta = (
  page: Ref<StreamerPage | undefined | null>
) => {
  const { t } = useI18n();

  const {
    public: { imageBaseUrl },
  } = useRuntimeConfig();
  useSeoMeta({
    title: () => t("head.tip", { path: page.value?.path || "" }),
  });

  useServerSeoMeta({
    ogTitle: t("head.XMRChatTip", { path: page.value?.path }),
    twitterTitle: t("head.XMRChatTip", { path: page.value?.path }),
    description: t("head.XMRChatTip", { path: page.value?.path }),
    ogDescription: t("head.XMRChatTip", { path: page.value?.path }),
    twitterDescription: null,
    twitterCard: "summary",
    twitterImage: `${imageBaseUrl}${page.value?.logo.url}`,
    ogImage: `${imageBaseUrl}${page.value?.logo.url}`,
  });
};
