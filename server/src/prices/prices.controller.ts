import { Controller, Get } from '@nestjs/common';
import { PricesService } from './prices.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('prices')
@IsPublic()
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @Get('')
  async prices() {
    const xmr = await this.pricesService.getMoneroUsdPrice();
    const ltc = await this.pricesService.getLitecoinUsdPrice();

    return {
      xmr,
      ltc,
    };
  }

  @Get('/xmr')
  xmrPrice() {
    return this.pricesService.getMoneroUsdPrice();
  }
}
