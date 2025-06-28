import { Controller, Get } from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { CoinDtoRO } from './dtos/swap.dto';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';

@Controller('swaps')
export class SwapsController {
  constructor(private swapsService: SwapsService) {}

  @IsPublic()
  @Serialize(CoinDtoRO)
  @Get('/coins')
  async getCoins() {
    const coins = await this.swapsService.findAllCoins();

    return {
      coins: coins.filter(
        (c) =>
          (c.network === 'Mainnet' && c.ticker === 'ltc') || // Litecoin
          (c.network === 'Mainnet' && c.ticker === 'btc') || // Bitcoin
          (c.network === 'Mainnet' && c.ticker === 'bch') || // Bitcoin Cash
          (c.network === 'SOL' && c.ticker === 'usdc'), // USDC
      ),
    };
  }

  @IsPublic()
  @Get('/min-swap')
  async minSwapAmount() {
    const coins = await this.swapsService.findAllCoins();
    const xmr = coins.find((c) => c.ticker === 'xmr');

    return {
      minimum: xmr?.minimum,
      maximum: xmr?.maximum,
    };
  }

  @IsPublic()
  @Get('/status')
  async swaps() {
    const active = await this.swapsService.getIsSwapActive();

    return {
      active,
    };
  }
}
