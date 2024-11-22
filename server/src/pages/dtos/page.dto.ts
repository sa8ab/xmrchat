import { Expose, Transform, Type } from 'class-transformer';
import { FileDto } from 'src/files/dtos/file.dto';
import { TierDto } from './tier/tier.dto';
import { MoneroUtils } from 'monero-ts';

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

  @Expose()
  @Transform(
    ({ value }) => value && MoneroUtils.atomicUnitsToXmr(value).toString(),
  )
  minTipAmount: string;
}
