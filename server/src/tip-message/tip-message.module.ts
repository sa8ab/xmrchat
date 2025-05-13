import { Module } from '@nestjs/common';
import { TipMessageService } from './tip-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/pages/page.entity';
import { PricesModule } from 'src/prices/prices.module';
import { Tip } from 'src/tips/tip.entity';

@Module({
  imports: [PricesModule, TypeOrmModule.forFeature([Page, Tip])],
  providers: [TipMessageService],
  exports: [TipMessageService],
})
export class TipMessageModule {}
