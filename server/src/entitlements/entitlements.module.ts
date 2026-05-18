import { Module } from '@nestjs/common';
import { EntitlementsService } from './entitlements.service';
import { Entitlement } from './entitlement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesModule } from 'src/pages/pages.module';
import { PaymentFlowModule } from 'src/payment-flow/payment-flow.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { LwsModule } from 'src/lws/lws.module';
import { TelegramModule as TelegramIntegrationModule } from 'src/integrations/telegram/telegram.module';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    PaymentFlowModule,
    PagesModule,
    PaymentsModule,
    LwsModule,
    TelegramIntegrationModule,
    PageSettingsModule,
    NotificationsModule,
    TypeOrmModule.forFeature([Entitlement]),
  ],
  providers: [EntitlementsService],
  exports: [EntitlementsService],
})
export class EntitlementsModule {}
