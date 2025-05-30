import type { ContentLinkFull } from "~/types";
import { ContentLinkPlatformEnum, FiatEnum } from "~/types/enums";

export const useConstants = () => {
  const { t } = useI18n();

  const CONTENT_LINKS: Record<ContentLinkPlatformEnum, ContentLinkFull> = {
    [ContentLinkPlatformEnum.X]: {
      name: "X (formerly Twitter)",
      colorClassName: "",
      iconClassName: "",
      icon: "i-tabler-brand-x",
      inputLabel: t("xUsername", { platform: "X (Twitter)" }),
      linkCreator: (v?: string) => `https://x.com/${v}`,
    },
    [ContentLinkPlatformEnum.WEBSITE]: {
      name: "Website",
      colorClassName: "",
      iconClassName: "",
      icon: "i-tabler-link",
      inputLabel: t("websiteLink"),
      linkCreator: (v?: string) => v,
    },
    [ContentLinkPlatformEnum.YOUTUBE]: {
      name: "Youtube",
      colorClassName: "text-[#FF0000]",
      iconClassName: "",
      icon: "i-tabler-brand-youtube",
      inputLabel: t("youtubeChannel"),
      linkCreator: (v?: string) => `https://www.youtube.com/@${v}`,
    },
    [ContentLinkPlatformEnum.RUMBLE]: {
      name: "Rumble",
      colorClassName: "text-[#85c742]",
      iconClassName: "",
      icon: "i-tabler-brand-rumble",
      inputLabel: t("xUsername", { platform: "Rumble" }),
      linkCreator: (v?: string) => `https://rumble.com/c/${v}`,
    },
    [ContentLinkPlatformEnum.TWITCH]: {
      name: "Twitch",
      colorClassName: "text-[#6441a5]",
      iconClassName: "",
      icon: "i-tabler-brand-twitch",
      inputLabel: t("xUsername", { platform: "Twitch" }),
      linkCreator: (v?: string) => `https://www.twitch.tv/${v}`,
    },
    [ContentLinkPlatformEnum.SUBSTACK]: {
      name: "Substack",
      colorClassName: "text-[#FF6719]",
      iconClassName: "max-w-5 max-h-5",
      icon: "i-simple-icons-substack",
      inputLabel: t("xUsername", { platform: "Substack" }),
      linkCreator: (v?: string) => `https://substack.com/@${v}`,
    },
    [ContentLinkPlatformEnum.ODYSEE]: {
      name: "Odysee",
      colorClassName: "text-[#de0050]",
      iconClassName: "",
      icon: "i-simple-icons-odysee",
      inputLabel: t("xUsername", { platform: "Odysee" }),
      linkCreator: (v?: string) => `https://odysee.com/@${v}`,
    },
    [ContentLinkPlatformEnum.INSTAGRAM]: {
      name: "Instagram",
      colorClassName: "text-[#E1306C]",
      iconClassName: "",
      icon: "i-tabler-brand-instagram",
      inputLabel: t("xUsername", { platform: "Instagram" }),
      linkCreator: (v?: string) => `https://instagram.com/${v}`,
    },
    [ContentLinkPlatformEnum.TELEGRAM]: {
      name: "Telegram",
      colorClassName: "text-[#24A1DE]",
      iconClassName: "",
      icon: "i-tabler-brand-telegram",
      inputLabel: t("xUsername", { platform: "Telegram" }),
      linkCreator: (v?: string) => `https://t.me/${v}`,
    },
    [ContentLinkPlatformEnum.TIKTOK]: {
      name: "Tiktok",
      colorClassName: "text-[#FE2C55]",
      iconClassName: "",
      icon: "i-tabler-brand-tiktok",
      inputLabel: t("xUsername", { platform: "Tiktok" }),
      linkCreator: (v?: string) => `https://tiktok.com/@${v}`,
    },
    [ContentLinkPlatformEnum.PODCAST_RSS]: {
      name: "Podcast RSS",
      colorClassName: "text-[#ee802f]",
      iconClassName: "",
      icon: "i-tabler-rss",
      inputLabel: t("podcastRssLink"),
      linkCreator: (v?: string) => `${v}`,
    },
    [ContentLinkPlatformEnum.NOSTR]: {
      name: "Nostr",
      colorClassName: "text-[#662482]",
      iconClassName: "",
      icon: "i-icon-nostr",
      inputLabel: t("nostrPubKey"),
    },
    [ContentLinkPlatformEnum.XMRBAZAAR]: {
      name: "xmrbazaar",
      colorClassName: "text-[#F25C05]",
      iconClassName: "",
      icon: "i-icon-xmrbazaar",
      inputLabel: t("xUsername", { platform: "Xmrbazaar" }),
      linkCreator: (v?: string) => `https://xmrbazaar.com/user/${v}`,
    },
    [ContentLinkPlatformEnum.KICK]: {
      name: "Kick",
      colorClassName: "text-[#53FC19]",
      iconClassName: "",
      icon: "i-tabler-brand-kick",
      inputLabel: t("xUsername", { platform: "Kick" }),
      linkCreator: (v?: string) => `https://kick.com/${v}`,
    },
  };
  const getContentLink = (v: ContentLinkPlatformEnum) => {
    return CONTENT_LINKS[v];
  };

  const fiats = computed(() => {
    return {
      [FiatEnum.USD]: {
        code: FiatEnum.USD,
        name: "USD",
        symbol: "US$",
      },
      [FiatEnum.EUR]: {
        code: FiatEnum.EUR,
        name: "EUR",
        symbol: "€",
      },
      [FiatEnum.MXN]: {
        code: FiatEnum.MXN,
        name: "MXN",
        symbol: "MEX$",
      },
    };
  });

  const getFiat = (v: FiatEnum) => fiats.value[v];

  return {
    getContentLink,
    CONTENT_LINKS,
    fiats,
    getFiat,
  };
};
