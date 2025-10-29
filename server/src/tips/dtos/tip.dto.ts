import { Expose, Type } from 'class-transformer';
import { PaymentDto } from 'src/payments/dtos/payment.dto';
import { SwapDto } from 'src/swaps/dtos/swap.dto';
import { TipRecipientDto } from './tip-recipient.dto';
import { BaseTipDto } from './base-tip.dto';

export class TipDto extends BaseTipDto {}

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

  @Expose()
  @Type(() => TipRecipientDto)
  tipRecipients: TipRecipientDto[];

  @Expose()
  url?: string;
}
