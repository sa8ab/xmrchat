import { Expose, Type } from 'class-transformer';
import { CoinDto } from 'src/integrations/trocador/dtos/coin.dto';
import { TipDto } from 'src/tips/dtos/tip.dto';

export class SwapDto {
  @Expose()
  id: number;

  @Expose()
  platform: string;

  @Expose()
  swapId: string;

  @Expose()
  inputAmount: string;

  @Expose()
  swapAddress: string;

  @Expose()
  status: string;

  @Expose()
  @Type(() => CoinDto)
  coin: CoinDto;

  @Expose()
  @Type(() => TipDto)
  tip: TipDto;

  @Expose()
  statusMessage: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
