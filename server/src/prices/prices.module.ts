import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { HttpModule } from '@nestjs/axios';
import { PricesController } from './prices.controller';
import { XmrPriceService } from './xmr-price.service';
import { CakeModule } from 'src/integrations/cake/cake.module';

@Module({
  imports: [HttpModule.register({}), CakeModule],
  providers: [PricesService, XmrPriceService],
  exports: [PricesService, XmrPriceService],
  controllers: [PricesController],
})
export class PricesModule {}
