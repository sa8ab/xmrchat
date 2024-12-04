import { PageLinkPLatform } from "~/types/enums";

export const PAGE_LINKS = {
  [PageLinkPLatform.X]: {
    name: "X",
    colorClassname: "",
    icon: "i-tabler-brand-x",
    inputLabel: "Twitter Username",
    linkCreator: (v?: string) => `https://x.com/${v}`,
  },
  [PageLinkPLatform.WEBSITE]: {
    name: "Website",
    colorClassname: "",
    icon: "i-tabler-link",
    inputLabel: "Website link",
    linkCreator: (v?: string) => v,
  },
  [PageLinkPLatform.YOUTUBE]: {
    name: "Youtube",
    colorClassname: "text-[#FF0000]",
    icon: "i-tabler-brand-youtube",
    inputLabel: "Youtube channel",
    linkCreator: (v?: string) => `https://www.youtube.com/@${v}`,
  },
  [PageLinkPLatform.RUMBLE]: {
    name: "Rumble",
    colorClassname: "text-[#85c742]",
    icon: "i-tabler-brand-rumble",
    inputLabel: "Rumble username",
    linkCreator: (v?: string) => `https://rumble.com/c/${v}`,
  },
  [PageLinkPLatform.TWITCH]: {
    name: "Twitch",
    colorClassname: "text-[#6441a5]",
    icon: "i-tabler-brand-twitch",
    inputLabel: "Twitch username",
    linkCreator: (v?: string) => `https://www.twitch.tv/${v}`,
  },
  [PageLinkPLatform.SUBSTACK]: {
    name: "Substack",
    colorClassname: "text-[#FF6719]",
    icon: "i-simple-icons-substack",
    inputLabel: "Substack username",
    linkCreator: (v?: string) => `https://substack.com/@${v}`,
  },
};
