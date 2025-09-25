import { Expose, Type } from 'class-transformer';
import { PageDto } from 'src/pages/dtos/page.dto';
import { LiveStreamPlatformEnum } from 'src/shared/constants';

export class LiveStreamDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  imageUrl: string;

  @Expose()
  channelId: string;

  @Expose()
  channelName: string;

  @Expose()
  viewerCount: number;

  @Expose()
  startedAt: Date;

  @Expose()
  platform: LiveStreamPlatformEnum;

  @Expose()
  @Type(() => PageDto)
  page: PageDto;
}

export class LiveStreamListDto {
  @Expose()
  @Type(() => LiveStreamDto)
  liveStreams: LiveStreamDto[];
}
