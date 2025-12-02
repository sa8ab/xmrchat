import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { XmrToAtomicTransform } from 'src/shared/decorators/xmr-to-atomic-transform.decorator';

export class CreateSuperDm {
  @IsString()
  @MinLength(2)
  @MaxLength(28)
  name: string;

  @IsString()
  @XmrToAtomicTransform({ toClassOnly: true })
  amount: string;

  @IsOptional()
  @IsNumber()
  coinId?: number;
}
