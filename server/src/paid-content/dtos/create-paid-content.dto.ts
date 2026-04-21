import { IsNumber, IsString } from 'class-validator';
import { XmrToAtomicTransform } from 'src/shared/decorators/xmr-to-atomic-transform.decorator';

export class CreatePaidContentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  duration: number;

  @IsString()
  @XmrToAtomicTransform({ toClassOnly: true })
  amount: string;
}
