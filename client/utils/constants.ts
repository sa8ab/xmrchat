import { ContentLinkFull } from "~/types";
import {
  ContentLinkPlatformEnum,
  PageStatusEnum,
  SwapStatusEnum,
  TipDisplayMode,
} from "~/types/enums";

export const CONTENT_LINKS_LIST = [
  ContentLinkPlatformEnum.X,
  ContentLinkPlatformEnum.NOSTR,
  ContentLinkPlatformEnum.PODCAST_RSS,
  ContentLinkPlatformEnum.SUBSTACK,
  ContentLinkPlatformEnum.TELEGRAM,
  ContentLinkPlatformEnum.INSTAGRAM,
  ContentLinkPlatformEnum.WEBSITE,
  ContentLinkPlatformEnum.YOUTUBE,
  ContentLinkPlatformEnum.RUMBLE,
  ContentLinkPlatformEnum.TWITCH,
  ContentLinkPlatformEnum.TIKTOK,
  ContentLinkPlatformEnum.ODYSEE,
  ContentLinkPlatformEnum.XMRBAZAAR,
  ContentLinkPlatformEnum.KICK,
  ContentLinkPlatformEnum.KUNO,
  ContentLinkPlatformEnum.PEERTUBE,
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

export const PAGE_STATUS = {
  [PageStatusEnum.ACTIVE]: { title: "Active", subjectTitle: "Activated" },
  [PageStatusEnum.DEACTIVE]: { title: "Deactive", subjectTitle: "Deactivated" },
};
