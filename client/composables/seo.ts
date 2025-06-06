import type { StreamerPage } from "~/types";

export const useAppSeoMeta = () => {
  const { t } = useI18n();

  const description = t("head.description");

  const title = t("head.title");
  useServerSeoMeta({
    description,
    ogTitle: title,
    ogDescription: description,
    twitterTitle: title,
    twitterDescription: description,
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
    description: t("head.XMRChatTip", { path: page.value?.path }),

    ogTitle: t("head.XMRChatTip", { path: page.value?.path }),
    ogDescription: t("head.XMRChatTip", { path: page.value?.path }),
    ogImage: `${imageBaseUrl}${page.value?.logo.url}`,

    twitterTitle: t("head.XMRChatTip", { path: page.value?.path }),
    twitterDescription: null,
    twitterImage: `${imageBaseUrl}${page.value?.logo.url}`,
    twitterCard: "summary",
  });
};
