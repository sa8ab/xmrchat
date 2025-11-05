import { Expose, Type } from 'class-transformer';
import { FileDto } from 'src/files/dtos/file.dto';

export class PageTipTierDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  minAmount?: string;

  @Expose()
  maxAmount?: string;

  @Expose()
  color?: string;

  @Expose()
  @Type(() => FileDto)
  sound?: FileDto;
}

export class PageTipTiersRO {
  @Expose()
  @Type(() => PageTipTierDto)
  pageTipTiers: PageTipTierDto[];
}
