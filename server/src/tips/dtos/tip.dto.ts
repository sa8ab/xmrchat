import { Expose, Type } from 'class-transformer';
import { PaymentDto } from 'src/payments/dtos/payment.dto';

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
}
