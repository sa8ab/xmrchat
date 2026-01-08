import { Controller, Get } from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { CoinDtoRO } from './dtos/swap.dto';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { PricesService } from 'src/prices/prices.service';
import { FiatEnum } from 'src/shared/constants';

@Controller('swaps')
export class SwapsController {
  constructor(
    private swapsService: SwapsService,
    private pricesService: PricesService,
  ) {}

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
          (c.network === 'SOL' &&
            c.ticker === 'usdc' &&
            c.name === 'USDC (SOL)') || // USDC
          (c.network === 'ERC20' && c.ticker === 'usdt'),
      ),
    };
  }

  @IsPublic()
  @Get('/min-swap')
  async minSwapAmount() {
    const coins = await this.swapsService.findAllCoins();
    const xmr = coins.find((c) => c.ticker === 'xmr');

    // Get XMR price in USD
    const xmrPrices = await this.pricesService.getMoneroPrices();
    const xmrUsdPrice = xmrPrices.usd;

    // If price is not available, return original minimum
    if (!xmrUsdPrice)
      return {
        minimum: xmr?.minimum,
        maximum: xmr?.maximum,
      };

    const minUsd = xmr.minimum * xmrUsdPrice;

    const minUsdRequired = 10;
    const adjustedMinUsd = Math.max(minUsd, minUsdRequired);
    const adjustedMinimum = adjustedMinUsd / xmrUsdPrice;

    const roundedMinimum = parseFloat(adjustedMinimum.toFixed(8));

    return {
      minimum: roundedMinimum,
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
