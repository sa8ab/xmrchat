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
  NOTIFICATIONS = 'notifications',
}

export enum PageSettingKey {
  TWITCH_CHANNEL = 'twitch-channel',
  OBS_KEEP_MESSAGES = 'obs-keep-messages',
  OBS_PLAY_SOUND = 'obs-play-sound',
  OBS_AUTO_SHOW_TIPS = 'obs-auto-show-tips',
  MIN_NOTIFICATION_THRESHOLD = 'min-notification-threshold',
  DAILY_SUMMARY_NOTIFICATION_TIME = 'daily-summary-notification-time',
}

export enum TipDisplayMode {
  XMR = 'xmr',
  FIAT = 'fiat',
}

export enum FiatEnum {
  USD = 'usd',
  EUR = 'eur',
  MXN = 'mxn',
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
  XMRBAZAAR = 'xmrbazaar',
  KICK = 'kick',
  PEERTUBE = 'peertube',
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

export enum AuditTypeEnum {
  PAGE_UPDATED = 'page-updated',
}

export enum RolesEnum {
  ADMIN = 'admin',
  STREAMER = 'streamer',
  COHOST = 'cohost',
}

export enum PageStatusEnum {
  ACTIVE = 'active',
  DEACTIVE = 'deactive',
}

export enum IntegrationConfigType {
  SINGAL = 'singal',
  TELEGRAM = 'telegram',
  SIMPLEX = 'simplex',
}

export enum NotificationPreferenceType {
  NEW_TIP = 'new_tip',
  DAILY_SUMMARY = 'daily_summary',
}

export enum NotificationChannelEnum {
  EMAIL = 'email',
  WEBHOOK = 'webhook',
  TELEGRAM = 'telegram',
  SINGAL = 'singal',
  SIMPLEX = 'simplex',
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Receive = 'receive',
}
