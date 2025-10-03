import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsEnum } from 'class-validator';
import { LiveStreamPlatformEnum } from 'src/shared/constants';

export class CreateLiveStreamDto {
  @IsEnum(LiveStreamPlatformEnum)
  platform?: LiveStreamPlatformEnum;

  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsString()
  imageUrl?: string;

  @IsString()
  channelId?: string;

  @IsString()
  channelName?: string;

  @IsString()
  videoId?: string;

  @IsObject()
  @IsOptional()
  data?: any;

  @IsNumber()
  viewerCount?: number;

  @IsString()
  startedAt?: string;

  @IsNumber()
  pageId?: number;
}
