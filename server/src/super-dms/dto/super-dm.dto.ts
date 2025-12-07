import { Expose, Type } from 'class-transformer';
import { PaymentDto } from 'src/payments/dtos/payment.dto';
import { SwapDto } from 'src/swaps/dtos/swap.dto';

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

  // TODO: add messages
}

export class SuperDmRO {
  @Expose()
  @Type(() => SuperDmDto)
  superDm: SuperDmDto;
}
