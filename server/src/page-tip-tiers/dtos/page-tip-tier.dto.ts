import { Expose, Transform, Type } from 'class-transformer';
import { MoneroUtils } from 'monero-ts';
import { FileDto } from 'src/files/dtos/file.dto';

export class PageTipTierDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  @Transform(({ value }) => value && MoneroUtils.atomicUnitsToXmr(value))
  minAmount?: number;

  @Expose()
  @Transform(({ value }) => value && MoneroUtils.atomicUnitsToXmr(value))
  maxAmount?: number;

  @Expose()
  color?: string;

  @Expose()
  @Type(() => FileDto)
  sound?: FileDto;
}

export class PageTipTierRO {
  @Expose()
  @Type(() => PageTipTierDto)
  pageTipTier: PageTipTierDto;
}

export class PageTipTiersRO {
  @Expose()
  @Type(() => PageTipTierDto)
  pageTipTiers: PageTipTierDto[];
}
