import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AtomicToXmrTransform } from 'src/shared/decorators/atomic-to-xmr-transform.decorator';
import { XmrToAtomicTransform } from 'src/shared/decorators/xmr-to-atomic-transform.decorator';
import { IsEncryptionPublicKey } from 'src/shared/validations/encryption-public-key.validator';
import { SuperDmDto } from './super-dm.dto';
import { SwapDto } from 'src/swaps/dtos/swap.dto';
import { PageRecipientShareDto } from 'src/page-recipients/dtos/recipient.dto';

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

export class SuperDmCreateRO {
  @Expose()
  @AtomicToXmrTransform()
  amount: number;

  @Expose()
  paymentAddress: string;

  @Expose()
  @Type(() => SuperDmDto)
  superDm: SuperDmDto;

  @Expose()
  @Type(() => SwapDto)
  swap: SwapDto;

  @Expose()
  @Type(() => PageRecipientShareDto)
  recipients: PageRecipientShareDto[];

  @Expose()
  url: string;
}
