export enum UserTokenType {
  EMAIL_VERIFICATION = 'email-verification',
  RESET_PASSWORD = 'reset-password',
}

export enum FileType {
  PAGE_LOGO = 'page-logo',
}

export enum PageSettingCategory {
  OBS = 'obs',
  STREAMING = 'streaming',
}

export enum PageSettingKey {
  TWITCH_CHANNEL = 'twitch-channel',
  OBS_KEEP_MESSAGES = 'obs-keep-messages',
  OBS_PLAY_SOUND = 'obs-play-sound',
}

export enum SupportedDisplayCurrency {
  XMR = 'xmr',
  USD = 'usd',
}

export enum PageSettingValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

export enum LinkPlatformEnum {
  X = 'x',
  WEBSITE = 'website',
  NOSTR = 'nostr',
  YOUTUBE = 'youtube',
  PODCAST_RSS = 'podcast-rss',
  RUMBLE = 'rumble',
  SUBSTACK = 'substack',
  TWITCH = 'twitch',
  TELEGRAM = 'telegram',
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  ODYSEE = 'odysee',
}

export enum TrocadorStatusEnum {
  WAITING = 'waiting',
  CONFIRMING = 'confirming',
  SENDING = 'sending',
  FINISHED = 'finished',

  FAILED = 'failed',
  EXPIRED = 'expired',
  HALTED = 'halted',
  REFUNDED = 'refunded',
}

export enum SwapStatusEnum {
  WAITING = 'waiting', // Waiting for payment
  CONFIRMING = 'confirming', // Paid and confirming the payment
  SENDING = 'sending',
  FINISHED = 'finished',

  FAILED = 'failed',
  EXPIRED = 'expired', // swap duration expired
}
