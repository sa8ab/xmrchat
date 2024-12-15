import { PageLinkPLatform, SupportedDisplayCurrency } from "~/types/enums";

export const PAGE_LINKS = {
  [PageLinkPLatform.X]: {
    name: "X",
    colorClassName: "",
    iconClassName: "",
    icon: "i-tabler-brand-x",
    inputLabel: "Twitter Username",
    linkCreator: (v?: string) => `https://x.com/${v}`,
  },
  [PageLinkPLatform.WEBSITE]: {
    name: "Website",
    colorClassName: "",
    iconClassName: "",
    icon: "i-tabler-link",
    inputLabel: "Website link",
    linkCreator: (v?: string) => v,
  },
  [PageLinkPLatform.YOUTUBE]: {
    name: "Youtube",
    colorClassName: "text-[#FF0000]",
    iconClassName: "",
    icon: "i-tabler-brand-youtube",
    inputLabel: "Youtube channel",
    linkCreator: (v?: string) => `https://www.youtube.com/@${v}`,
  },
  [PageLinkPLatform.RUMBLE]: {
    name: "Rumble",
    colorClassName: "text-[#85c742]",
    iconClassName: "",
    icon: "i-tabler-brand-rumble",
    inputLabel: "Rumble username",
    linkCreator: (v?: string) => `https://rumble.com/c/${v}`,
  },
  [PageLinkPLatform.TWITCH]: {
    name: "Twitch",
    colorClassName: "text-[#6441a5]",
    iconClassName: "",
    icon: "i-tabler-brand-twitch",
    inputLabel: "Twitch username",
    linkCreator: (v?: string) => `https://www.twitch.tv/${v}`,
  },
  [PageLinkPLatform.SUBSTACK]: {
    name: "Substack",
    colorClassName: "text-[#FF6719]",
    iconClassName: "max-w-5 max-h-5",
    icon: "i-simple-icons-substack",
    inputLabel: "Substack username",
    linkCreator: (v?: string) => `https://substack.com/@${v}`,
  },
};

export const SUPPORTED_TIP_VALUES = [
  { value: SupportedDisplayCurrency.XMR, label: "XMR" },
  { value: SupportedDisplayCurrency.USD, label: "USD" },
];
