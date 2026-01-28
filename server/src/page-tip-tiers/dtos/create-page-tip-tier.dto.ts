import { Transform, Type } from 'class-transformer';
import {
  IsHexColor,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsRgbColor,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { MoneroUtils } from 'monero-ts';

export class CreatePageTipTierDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;

  // gets xmr, converts to atomic units
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
  @Transform(
    ({ value }) => {
      if (value === null || value === '') return null;
      return MoneroUtils.xmrToAtomicUnits(value).toString();
    },
    { toClassOnly: true },
  )
  maxAmount?: string;

  @IsNumber()
  @IsOptional()
  @Min(255)
  @Type(() => Number)
  messageLength?: number;

  @IsRgbColor()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsOptional()
  soundId?: number;
}
