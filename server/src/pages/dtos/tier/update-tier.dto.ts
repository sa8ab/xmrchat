import { IsNumber, IsOptional } from 'class-validator';
import { CreateTierBaseDto } from './create-tier-base.dto';

export class UpdateTierDto extends CreateTierBaseDto {
  @IsOptional()
  @IsNumber()
  id: number;
}
