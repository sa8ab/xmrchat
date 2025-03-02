export enum UploadSlug {
  PAGE_LOGO = "page-logo",
}

export enum PageSettingKey {
  TWITCH_CHANNEL = "twitch-channel",
  OBS_KEEP_MESSAGES = "obs-keep-messages",
  OBS_PLAY_SOUND = "obs-play-sound",
}

export enum ContentLinkPlatformEnum {
  X = "x",
  WEBSITE = "website",
  NOSTR = "nostr",
  YOUTUBE = "youtube",
  PODCAST_RSS = "podcast-rss",
  RUMBLE = "rumble",
  SUBSTACK = "substack",
  TWITCH = "twitch",
  TELEGRAM = "telegram",
  TIKTOK = "tiktok",
  INSTAGRAM = "instagram",
  ODYSEE = "odysee",
}

export enum SupportedDisplayCurrency {
  XMR = "xmr",
  USD = "usd",
}

export enum SwapStatusEnum {
  WAITING = "waiting",
  CONFIRMING = "confirming",
  SENDING = "sending",
  FINISHED = "finished",

  FAILED = "failed",
  EXPIRED = "expired",
}

export enum RolesEnum {
  ADMIN = "admin",
  STREAMER = "streamer",
  COHOST = "cohost",
}

export enum PageStatusEnum {
  ACTIVE = "active",
  DEACTIVE = "deactive",
}
