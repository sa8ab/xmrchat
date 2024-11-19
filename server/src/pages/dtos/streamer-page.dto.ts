import { Expose, Type } from 'class-transformer';
import { PageDto } from './page.dto';

export class StreamerPageDto extends PageDto {
  @Expose()
  primaryAddress: string;

  @Expose()
  secretViewKey: string;

  @Expose()
  isPublic: string;
}

export class StreamerPageRO {
  @Expose()
  @Type(() => StreamerPageDto)
  page: StreamerPageDto;
}
