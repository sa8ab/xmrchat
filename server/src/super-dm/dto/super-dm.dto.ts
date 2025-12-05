import { Expose, Type } from 'class-transformer';
import { PageRecipientShareDto } from 'src/page-recipients/dtos/recipient.dto';
import { PaymentDto } from 'src/payments/dtos/payment.dto';
import { AtomicToXmrTransform } from 'src/shared/decorators/atomic-to-xmr-transform.decorator';
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
  @Type(() => SwapDto)
  payment: PaymentDto;

  @Expose()
  expiresAt: Date;

  @Expose()
  createdAt: string;

  // TODO: add messages
}

export class SuperDmRo {
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
