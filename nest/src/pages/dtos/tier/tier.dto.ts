import { Expose } from 'class-transformer';

export class TierDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  amount: string;
}
