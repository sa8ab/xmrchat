import {
  PageSettingCategory,
  PageSettingKey,
  PageSettingValueType,
} from '../constants';

type PageSettingDefinition = {
  category: PageSettingCategory;
  type: PageSettingValueType;
};

const setting = (
  category: PageSettingCategory,
  type: PageSettingValueType,
): PageSettingDefinition => ({ category, type });

export const PAGE_SETTINGS: Record<PageSettingKey, PageSettingDefinition> = {
  // OBS
  [PageSettingKey.OBS_PLAY_SOUND]: setting(
    PageSettingCategory.OBS,
    PageSettingValueType.BOOLEAN,
  ),
  [PageSettingKey.OBS_KEEP_MESSAGES]: setting(
    PageSettingCategory.OBS,
    PageSettingValueType.BOOLEAN,
  ),
  [PageSettingKey.OBS_AUTO_SHOW_TIPS]: setting(
    PageSettingCategory.OBS,
    PageSettingValueType.BOOLEAN,
  ),
  [PageSettingKey.OBS_SOUND]: setting(
    PageSettingCategory.OBS,
    PageSettingValueType.NUMBER,
  ),

  // Twitch
  [PageSettingKey.TWITCH_CHANNEL]: setting(
    PageSettingCategory.STREAMING,
    PageSettingValueType.STRING,
  ),

  // Notifications
  [PageSettingKey.MIN_NOTIFICATION_THRESHOLD]: setting(
    PageSettingCategory.NOTIFICATIONS,
    PageSettingValueType.NUMBER,
  ),
  [PageSettingKey.DAILY_SUMMARY_NOTIFICATION_TIME]: setting(
    PageSettingCategory.NOTIFICATIONS,
    PageSettingValueType.STRING,
  ),

  // Super DM
  [PageSettingKey.SUPER_DM_MIN_AMOUNT]: setting(
    PageSettingCategory.SUPER_DM,
    PageSettingValueType.STRING,
  ),
  [PageSettingKey.SUPER_DM_PUBLIC_KEY]: setting(
    PageSettingCategory.SUPER_DM,
    PageSettingValueType.STRING,
  ),
  [PageSettingKey.SUPER_DM_ACTIVE]: setting(
    PageSettingCategory.SUPER_DM,
    PageSettingValueType.BOOLEAN,
  ),

  // Paid content
  [PageSettingKey.TELEGRAM_USER_ID]: setting(
    PageSettingCategory.PAID_CONTENT,
    PageSettingValueType.STRING,
  ),
  [PageSettingKey.TELEGRAM_PAID_CONTENT_ID]: setting(
    PageSettingCategory.PAID_CONTENT,
    PageSettingValueType.STRING,
  ),

  // Tip reply
  [PageSettingKey.TIP_REPLY_BACKGROUND_COLOR]: setting(
    PageSettingCategory.TIP_REPLIES,
    PageSettingValueType.STRING,
  ),
  [PageSettingKey.TIP_REPLY_TEXT_COLOR]: setting(
    PageSettingCategory.TIP_REPLIES,
    PageSettingValueType.STRING,
  ),
};

export const getPageSettingCategory = (key: PageSettingKey) =>
  PAGE_SETTINGS[key].category;

export const getPageSettingType = (key: PageSettingKey) =>
  PAGE_SETTINGS[key].type;
