import { Expose } from 'class-transformer';

export class CoinDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  ticker: string;

  @Expose()
  network: string;

  @Expose()
  image: string;

  @Expose()
  minimum: number;

  @Expose()
  maximum: number;
}
