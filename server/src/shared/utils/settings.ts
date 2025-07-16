import {
  PageSettingCategory,
  PageSettingKey,
  PageSettingValueType,
} from '../constants';

export const PAGE_SETTINGS = {
  [PageSettingKey.OBS_PLAY_SOUND]: {
    category: PageSettingCategory.OBS,
    type: PageSettingValueType.BOOLEAN,
  },
  [PageSettingKey.OBS_KEEP_MESSAGES]: {
    category: PageSettingCategory.OBS,
    type: PageSettingValueType.BOOLEAN,
  },
  [PageSettingKey.TWITCH_CHANNEL]: {
    category: PageSettingCategory.STREAMING,
    type: PageSettingValueType.STRING,
  },
  [PageSettingKey.OBS_AUTO_SHOW_TIPS]: {
    category: PageSettingCategory.OBS,
    type: PageSettingValueType.BOOLEAN,
  },
  [PageSettingKey.MIN_NOTIFICATION_THRESHOLD]: {
    category: PageSettingCategory.NOTIFICATIONS,
    type: PageSettingValueType.NUMBER,
  },
  [PageSettingKey.DAILY_SUMMARY_NOTIFICATION_TIME]: {
    category: PageSettingCategory.NOTIFICATIONS,
    type: PageSettingValueType.STRING,
  },
};

export const getPageSettingCategory = (key: PageSettingKey) =>
  PAGE_SETTINGS[key].category;

export const getPageSettingType = (key: PageSettingKey) =>
  PAGE_SETTINGS[key].type;
