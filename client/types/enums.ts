export enum UploadSlug {
  PAGE_LOGO = "page-logo",
}

export enum PageSettingKey {
  TWITCH_CHANNEL = "twitch-channel",
  OBS_KEEP_MESSAGES = "obs-keep-messages",
  OBS_PLAY_SOUND = "obs-play-sound",
  OBS_AUTO_SHOW_TIPS = "obs-auto-show-tips",
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
  XMRBAZAAR = "xmrbazaar",
  KICK = "kick",
  KUNO = "kuno",
  PEERTUBE = "peertube",
}

export enum TipDisplayMode {
  XMR = "xmr",
  FIAT = "fiat",
}

export enum FiatEnum {
  USD = "usd",
  EUR = "eur",
  MXN = "mxn",
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

export enum NotificationPreferenceType {
  NEW_TIP = "new_tip",
  DAILY_SUMMARY = "daily_summary",
}

export enum NotificationChannelEnum {
  EMAIL = "email",
  // WEBHOOK = "webhook",
  // TELEGRAM = "telegram",
  SIMPLEX = "simplex",
  SIGNAL = "signal",
}

export enum IntegrationConfigType {
  SIGNAL = "signal",
  TELEGRAM = "telegram",
  SIMPLEX = "simplex",
}
