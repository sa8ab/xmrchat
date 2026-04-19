import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { XmrToAtomicTransform } from 'src/shared/decorators/xmr-to-atomic-transform.decorator';

export class CreateOfferingDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsString()
  @XmrToAtomicTransform({ toClassOnly: true })
  amount: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
