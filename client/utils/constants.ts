import {
  ContentLinkPlatformEnum,
  SupportedDisplayCurrency,
  SwapStatusEnum,
} from "~/types/enums";

export const CONTENT_LINKS = [
  {
    platform: ContentLinkPlatformEnum.X,
    name: "X",
    colorClassName: "",
    iconClassName: "",
    icon: "i-tabler-brand-x",
    inputLabel: "Twitter Username",
    linkCreator: (v?: string) => `https://x.com/${v}`,
  },
  {
    platform: ContentLinkPlatformEnum.WEBSITE,
    name: "Website",
    colorClassName: "",
    iconClassName: "",
    icon: "i-tabler-link",
    inputLabel: "Website link",
    linkCreator: (v?: string) => v,
  },
  {
    platform: ContentLinkPlatformEnum.YOUTUBE,
    name: "Youtube",
    colorClassName: "text-[#FF0000]",
    iconClassName: "",
    icon: "i-tabler-brand-youtube",
    inputLabel: "Youtube channel",
    linkCreator: (v?: string) => `https://www.youtube.com/@${v}`,
  },
  {
    platform: ContentLinkPlatformEnum.RUMBLE,
    name: "Rumble",
    colorClassName: "text-[#85c742]",
    iconClassName: "",
    icon: "i-tabler-brand-rumble",
    inputLabel: "Rumble username",
    linkCreator: (v?: string) => `https://rumble.com/c/${v}`,
  },
  {
    platform: ContentLinkPlatformEnum.TWITCH,
    name: "Twitch",
    colorClassName: "text-[#6441a5]",
    iconClassName: "",
    icon: "i-tabler-brand-twitch",
    inputLabel: "Twitch username",
    linkCreator: (v?: string) => `https://www.twitch.tv/${v}`,
  },
  {
    platform: ContentLinkPlatformEnum.SUBSTACK,
    name: "Substack",
    colorClassName: "text-[#FF6719]",
    iconClassName: "max-w-5 max-h-5",
    icon: "i-simple-icons-substack",
    inputLabel: "Substack username",
    linkCreator: (v?: string) => `https://substack.com/@${v}`,
  },
];

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
