import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import {
  NotificationChannelEnum,
  NotificationPreferenceType,
} from 'src/shared/constants';

export class UpdateNotificationPreferenceDto {
  @IsEnum(NotificationPreferenceType)
  type: NotificationPreferenceType;

  @IsEnum(NotificationChannelEnum)
  channel: NotificationChannelEnum;

  @IsBoolean()
  enabled: boolean;
}

export class UpdateNotificationPreferencesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateNotificationPreferenceDto)
  preferences: UpdateNotificationPreferenceDto[];
}
