import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { PricesService } from './prices.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { FiatEnum } from 'src/shared/constants';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@SkipThrottle()
@Controller('prices')
@IsPublic()
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @Get('')
  async prices() {
    const xmr = await this.pricesService.getMoneroPrices();

    return {
      xmr,
    };
  }

  @Get('/xmr')
  async xmrPrice() {
    return this.pricesService.getMoneroPrice(FiatEnum.USD);
  }
}
