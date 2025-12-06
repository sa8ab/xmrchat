import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
import { XmrToAtomicTransform } from 'src/shared/decorators/xmr-to-atomic-transform.decorator';

export class UpdateSuperDmSettingDto {
  @IsBoolean()
  superDmActive: boolean;

  @IsString()
  @XmrToAtomicTransform({ toClassOnly: true })
  minSuperDmAmount: string;
}
