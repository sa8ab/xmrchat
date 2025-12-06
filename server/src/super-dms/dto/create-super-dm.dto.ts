import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { XmrToAtomicTransform } from 'src/shared/decorators/xmr-to-atomic-transform.decorator';
import { IsEncryptionPublicKey } from 'src/shared/validations/encryption-public-key.validator';

export class CreateSuperDmDto {
  @IsString()
  @IsNotEmpty()
  path: string;

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

  @IsEncryptionPublicKey()
  publicKey: string;
}
