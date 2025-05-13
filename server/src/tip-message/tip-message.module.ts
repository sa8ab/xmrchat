import { Module } from '@nestjs/common';
import { TipMessageService } from './tip-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/pages/page.entity';
import { PricesModule } from 'src/prices/prices.module';

@Module({
  imports: [PricesModule, TypeOrmModule.forFeature([Page])],
  providers: [TipMessageService],
  exports: [TipMessageService],
})
export class TipMessageModule {}
