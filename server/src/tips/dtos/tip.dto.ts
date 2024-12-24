import { Expose, Type } from 'class-transformer';
import { PaymentDto } from 'src/payments/dtos/payment.dto';
import { SwapDto } from 'src/swaps/dtos/swap.dto';

export class TipDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  message: string;

  @Expose()
  private: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @Expose()
  @Type(() => SwapDto)
  swap: SwapDto;
}

export class TipDtoRO {
  @Expose()
  amount: string;

  @Expose()
  paymentAddress: string;

  @Expose()
  @Type(() => TipDto)
  tip: TipDto;

  @Expose()
  id: number;

  @Expose()
  @Type(() => SwapDto)
  swap: SwapDto;
}
