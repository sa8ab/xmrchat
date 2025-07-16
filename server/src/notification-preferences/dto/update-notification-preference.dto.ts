import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
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

  @IsNumber()
  @IsOptional()
  minNotificationThreshold: number;

  @IsString()
  @IsOptional()
  @IsMilitaryTime()
  dailySummaryTime: string;
}
