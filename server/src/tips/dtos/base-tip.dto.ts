import { Expose, Transform, Type } from 'class-transformer';
import { PaymentDto } from 'src/payments/dtos/payment.dto';
import { SwapDto } from 'src/swaps/dtos/swap.dto';

export class BaseTipDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value, obj, options }) => {
    if (options.groups.includes('streamer')) return value;
    if (obj.private) return '';
    return value;
  })
  name: string;

  @Expose()
  @Transform(({ value, obj, options }) => {
    if (options.groups.includes('streamer')) return value;
    if (obj.private) return '';
    return value;
  })
  message: string;

  @Expose()
  private: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  expiresAt: Date;

  @Expose()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @Expose()
  @Type(() => SwapDto)
  swap: SwapDto;
}
