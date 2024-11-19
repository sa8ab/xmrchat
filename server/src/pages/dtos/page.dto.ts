import { Expose, Type } from 'class-transformer';
import { FileDto } from 'src/files/dtos/file.dto';
import { TierDto } from './tier/tier.dto';

export class PageDto {
  @Expose()
  id: number;

  @Expose()
  path: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => FileDto)
  logo: FileDto;

  @Expose()
  @Type(() => FileDto)
  coverImage: FileDto;

  @Expose()
  description: string;

  @Expose()
  @Type(() => TierDto)
  tiers: TierDto[];

  @Expose()
  twitchChannel: string;
}
