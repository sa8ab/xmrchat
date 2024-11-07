import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { HttpModule } from '@nestjs/axios';
import { PricesController } from './prices.controller';

@Module({
  imports: [HttpModule.register({})],
  providers: [PricesService],
  exports: [PricesService],
  controllers: [PricesController],
})
export class PricesModule {}
