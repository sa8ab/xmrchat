import { Module } from '@nestjs/common';
import { EntitlementsService } from './entitlements.service';
import { Entitlement } from './entitlement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesModule } from 'src/pages/pages.module';
import { PaymentFlowModule } from 'src/payment-flow/payment-flow.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { LwsModule } from 'src/lws/lws.module';
import { TelegramModule as TelegramIntegrationModule } from 'src/integrations/telegram/telegram.module';

@Module({
  imports: [
    PaymentFlowModule,
    PagesModule,
    PaymentsModule,
    LwsModule,
    TelegramIntegrationModule,
    TypeOrmModule.forFeature([Entitlement]),
  ],
  providers: [EntitlementsService],
  exports: [EntitlementsService],
})
export class EntitlementsModule {}
