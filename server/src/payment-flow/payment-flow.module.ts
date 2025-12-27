import { Module } from '@nestjs/common';
import { PaymentFlowService } from './payment-flow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tip } from 'src/tips/tip.entity';
import { Page } from 'src/pages/page.entity';
import { Payment } from 'src/payments/payment.entity';
import { PagesModule } from 'src/pages/pages.module';
import { TipsModule } from 'src/tips/tips.module';
import { SwapsModule } from 'src/swaps/swaps.module';
import { LwsModule } from 'src/lws/lws.module';

@Module({
  imports: [PagesModule, SwapsModule, LwsModule],
  providers: [PaymentFlowService],
  exports: [PaymentFlowService],
})
export class PaymentFlowModule {}
