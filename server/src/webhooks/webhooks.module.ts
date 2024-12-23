import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { PaymentsModule } from 'src/payments/payments.module';
import { PagesModule } from 'src/pages/pages.module';
import { TipsModule } from 'src/tips/tips.module';
import { SwapsModule } from 'src/swaps/swaps.module';

@Module({
  imports: [PaymentsModule, PagesModule, TipsModule, SwapsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
