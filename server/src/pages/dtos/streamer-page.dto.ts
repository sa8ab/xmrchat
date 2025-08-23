import { Expose, Type } from 'class-transformer';
import { PageDto } from './page.dto';
import { PageStatusEnum } from 'src/shared/constants';

export class StreamerPageDto extends PageDto {
  @Expose()
  primaryAddress: string;

  @Expose()
  secretViewKey: string;

  @Expose()
  isPublic: string;

  @Expose()
  isPremium: boolean;

  @Expose()
  status: PageStatusEnum;
}

export class StreamerPageRO {
  @Expose()
  @Type(() => StreamerPageDto)
  page: StreamerPageDto;
}
