import { Type } from 'class-transformer';
import { CreatePageBaseDto } from './create-page-base.dto';
import { UpdateTierDto } from './tier/update-tier.dto';
import {
  IsNumberString,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class UpdatePageDto extends CreatePageBaseDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateTierDto)
  tiers: UpdateTierDto[];

  @MaxLength(20)
  @IsNumberString()
  @IsOptional()
  minTipAmount: string;
}
