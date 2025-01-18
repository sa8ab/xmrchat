import {
  ContentLinkPlatformEnum,
  SupportedDisplayCurrency,
  SwapStatusEnum,
} from "~/types/enums";

export const CONTENT_LINKS = {
  [ContentLinkPlatformEnum.X]: {
    name: "X",
    colorClassName: "",
    iconClassName: "",
    icon: "i-tabler-brand-x",
    inputLabel: "Twitter username",
    linkCreator: (v?: string) => `https://x.com/${v}`,
  },
  [ContentLinkPlatformEnum.WEBSITE]: {
    name: "Website",
    colorClassName: "",
    iconClassName: "",
    icon: "i-tabler-link",
    inputLabel: "Website link",
    linkCreator: (v?: string) => v,
  },
  [ContentLinkPlatformEnum.YOUTUBE]: {
    name: "Youtube",
    colorClassName: "text-[#FF0000]",
    iconClassName: "",
    icon: "i-tabler-brand-youtube",
    inputLabel: "Youtube channel",
    linkCreator: (v?: string) => `https://www.youtube.com/@${v}`,
  },
  [ContentLinkPlatformEnum.RUMBLE]: {
    name: "Rumble",
    colorClassName: "text-[#85c742]",
    iconClassName: "",
    icon: "i-tabler-brand-rumble",
    inputLabel: "Rumble username",
    linkCreator: (v?: string) => `https://rumble.com/c/${v}`,
  },
  [ContentLinkPlatformEnum.TWITCH]: {
    name: "Twitch",
    colorClassName: "text-[#6441a5]",
    iconClassName: "",
    icon: "i-tabler-brand-twitch",
    inputLabel: "Twitch username",
    linkCreator: (v?: string) => `https://www.twitch.tv/${v}`,
  },
  [ContentLinkPlatformEnum.SUBSTACK]: {
    name: "Substack",
    colorClassName: "text-[#FF6719]",
    iconClassName: "max-w-5 max-h-5",
    icon: "i-simple-icons-substack",
    inputLabel: "Substack username",
    linkCreator: (v?: string) => `https://substack.com/@${v}`,
  },
  [ContentLinkPlatformEnum.ODYSEE]: {
    name: "Odysee",
    colorClassName: "text-[#de0050]",
    iconClassName: "",
    icon: "i-simple-icons-odysee",
    inputLabel: "Odysee username",
    linkCreator: (v?: string) => `https://odysee.com/@${v}`,
  },
  [ContentLinkPlatformEnum.INSTAGRAM]: {
    name: "Instagram",
    colorClassName: "text-[#E1306C]",
    iconClassName: "",
    icon: "i-tabler-brand-instagram",
    inputLabel: "Instagram username",
    linkCreator: (v?: string) => `https://instagram.com/${v}`,
  },
  [ContentLinkPlatformEnum.TELEGRAM]: {
    name: "Telegram",
    colorClassName: "text-[#24A1DE]",
    iconClassName: "",
    icon: "i-tabler-brand-telegram",
    inputLabel: "Telegram username",
    linkCreator: (v?: string) => `https://t.me/${v}`,
  },
  [ContentLinkPlatformEnum.TIKTOK]: {
    name: "Tiktok",
    colorClassName: "text-[#FE2C55]",
    iconClassName: "",
    icon: "i-tabler-brand-tiktok",
    inputLabel: "Tiktok username",
    linkCreator: (v?: string) => `https://tiktok.com/@${v}`,
  },
  [ContentLinkPlatformEnum.PODCAST_RSS]: {
    platform: ContentLinkPlatformEnum.ODYSEE,
    name: "Podcast RSS",
    colorClassName: "text-[#ee802f]",
    iconClassName: "",
    icon: "i-tabler-rss",
    inputLabel: "Podcast RSS Link",
    linkCreator: (v?: string) => `${v}`,
  },
};

export const SUPPORTED_TIP_VALUES = [
  { value: SupportedDisplayCurrency.XMR, label: "XMR" },
  { value: SupportedDisplayCurrency.USD, label: "USD" },
];

export const SWAP_STATUSES = {
  [SwapStatusEnum.CONFIRMING]: {
    label: "Confirming",
    color: "green",
  },
  [SwapStatusEnum.WAITING]: {
    label: "Waiting",
    color: "orange",
  },
  [SwapStatusEnum.SENDING]: {
    label: "Sending",
    color: "green",
  },
  [SwapStatusEnum.FINISHED]: {
    label: "Finished",
    color: "green",
  },
  [SwapStatusEnum.EXPIRED]: {
    label: "Expired",
    color: "red",
  },
  [SwapStatusEnum.FAILED]: {
    label: "Failed",
    color: "red",
  },
};
