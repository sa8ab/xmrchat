import { Expose, Type } from 'class-transformer';
import { Coin } from 'src/integrations/trocador/coin.entity';
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
  coin: Coin;

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
