import { Expose, Transform, Type } from 'class-transformer';
import { MoneroUtils } from 'monero-ts';
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
  @Transform(({ value }) => value && MoneroUtils.atomicUnitsToXmr(value))
  minNotificationThreshold: number;

  @Expose()
  dailySummaryTime: string;
}
