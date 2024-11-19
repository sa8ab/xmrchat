import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { PaymentsModule } from 'src/payments/payments.module';
import { PagesModule } from 'src/pages/pages.module';
import { TipsModule } from 'src/tips/tips.module';

@Module({
  imports: [PaymentsModule, PagesModule, TipsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
