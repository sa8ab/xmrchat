import { Expose } from 'class-transformer';

export class PaymentDto {
  @Expose()
  id: number;

  @Expose()
  pageSlug?: string;

  @Expose()
  amount: string;

  @Expose()
  paidAmount: string;

  @Expose()
  createdAt: string;

  @Expose()
  paidAt: Date;
}
