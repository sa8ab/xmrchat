import { Transform } from 'class-transformer';
import {
  IsHexColor,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsRgbColor,
  IsString,
  MaxLength,
} from 'class-validator';
import { MoneroUtils } from 'monero-ts';

export class CreatePageTipTierDto {
  @IsString()
  @MaxLength(40)
  name: string;

  @IsString()
  @MaxLength(400)
  @IsOptional()
  description?: string;

  // gets xmr, converts to atomic units
  @IsOptional()
  @IsNumberString()
  @Transform(
    ({ value }) => {
      if (value === null || value === '') return null;
      return MoneroUtils.xmrToAtomicUnits(value).toString();
    },
    { toClassOnly: true },
  )
  minAmount?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) =>
    MoneroUtils.xmrToAtomicUnits(value ?? '').toString(),
  )
  maxAmount?: string;

  @IsString()
  @IsRgbColor()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsOptional()
  soundId?: number;
}
