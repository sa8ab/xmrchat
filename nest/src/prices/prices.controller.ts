import { Controller, Get } from '@nestjs/common';
import { PricesService } from './prices.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';

@Controller('prices')
@IsPublic()
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @Get('/xmr')
  xmrPrice() {
    return this.pricesService.getMoneroUsdPrice();
  }
}
