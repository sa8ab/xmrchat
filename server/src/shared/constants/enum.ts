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
  TIPPING = 'tipping',
}

export enum PageSettingKey {
  TWITCH_CHANNEL = 'twitch-channel',
  OBS_KEEP_MESSAGES = 'obs-keep-messages',
  OBS_PLAY_SOUND = 'obs-play-sound',

  // Default currency that the tips should be displayed in.
  DEFAULT_TIP_AMOUNT_DISPLAY = 'default-tip-amount-display',
}

export enum PageSettingValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

export enum LinkPlatformEnum {
  X = 'x',
  WEBSITE = 'website',
  YOUTUBE = 'youtube',
  TWITCH = 'twitch',
  RUMBLE = 'rumble',
  SUBSTACK = 'substack',
}
