import { Expose, Type } from 'class-transformer';
import {
  NotificationChannelEnum,
  NotificationPreferenceType,
} from 'src/shared/constants';

export class NotificationPreferenceDto {
  @Expose()
  id: number;

  @Expose()
  type: NotificationPreferenceType;

  @Expose()
  channel: NotificationChannelEnum;

  @Expose()
  enabled: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class NotificationPreferencesRO {
  @Expose()
  @Type(() => NotificationPreferenceDto)
  preferences: NotificationPreferenceDto[];

  @Expose()
  minNotificationThreshold: number;
}
