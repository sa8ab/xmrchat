import { Expose, Type } from 'class-transformer';
import { PaymentDto } from 'src/payments/dtos/payment.dto';
import { SwapDto } from 'src/swaps/dtos/swap.dto';
import { SuperDmMessageDto } from './super-dm-message.dto';

export class SuperDmDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  publicKey: string;

  @Expose()
  @Type(() => SwapDto)
  swap: SwapDto;

  @Expose()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @Expose()
  expiresAt: Date;

  @Expose()
  createdAt: string;

  @Expose()
  endedAt: Date;

  @Expose()
  endedByType: string;

  @Expose()
  @Type(() => SuperDmMessageDto)
  messages: SuperDmMessageDto[];
}

export class SuperDmRO {
  @Expose()
  @Type(() => SuperDmDto)
  superDm: SuperDmDto;
}

export class SuperDmsRO {
  @Expose()
  @Type(() => SuperDmDto)
  superDms: SuperDmDto[];

  @Expose()
  settingsConfigured: boolean;
}
