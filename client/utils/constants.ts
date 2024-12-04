import { PageLinkPLatform } from "~/types/enums";

export const PAGE_LINKS = {
  [PageLinkPLatform.X]: {
    name: "X",
    iconClassNames: "",
    icon: "i-table-brand-x",
    inputLabel: "Twitter Username",
    linkCreator: (v?: string) => `https://x.com/${v}`,
  },
  [PageLinkPLatform.WEBSITE]: {
    name: "Website",
    iconClassNames: "",
    icon: "i-table-link",
    inputLabel: "Website link",
    linkCreator: (v?: string) => v,
  },
  [PageLinkPLatform.YOUTUBE]: {
    name: "Youtube",
    iconClassNames: "text-[#FF0000]",
    icon: "i-table-brand-youtube",
    inputLabel: "Youtube channel",
    linkCreator: (v?: string) => `https://www.youtube.com/@${v}`,
  },
  [PageLinkPLatform.RUMBLE]: {
    name: "Rumble",
    iconClassNames: "text-[#85c742]",
    icon: "i-table-brand-rumble",
    inputLabel: "Rumble username",
    linkCreator: (v?: string) => `https://rumble.com/c/${v}`,
  },
  [PageLinkPLatform.TWITCH]: {
    name: "Twitch",
    iconClassNames: "text-[#6441a5]",
    icon: "i-table-brand-twitch",
    inputLabel: "Twitch username",
    linkCreator: (v?: string) => `https://www.twitch.tv/${v}`,
  },
  [PageLinkPLatform.SUBSTACK]: {
    name: "Substack",
    iconClassNames: "text-[#FF6719] max-w-5 max-h-5",
    icon: "i-simple-icons-substack",
    inputLabel: "Substack username",
    linkCreator: (v?: string) => `https://substack.com/@${v}`,
  },
};
