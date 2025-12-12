import { Module } from '@nestjs/common';
import { SuperDmsService } from './super-dms.service';
import { SuperDmsController } from './super-dms.controller';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';
import { PagesModule } from 'src/pages/pages.module';
import { SuperDmSettingsService } from './super-dm-settings.service';
import { PaymentFlowModule } from 'src/payment-flow/payment-flow.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperDm } from './super-dm.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { SwapsModule } from 'src/swaps/swaps.module';
import { PageRecipientsModule } from 'src/page-recipients/page-recipients.module';
import { SuperDmsGateway } from './super-dms.gateway';
import { LwsModule } from 'src/lws/lws.module';
import { SuperDmMessage } from './super-sm-message.entity';
import { UsersModule } from 'src/users/users.module';
import { NotificationPreferencesModule } from 'src/notification-preferences/notification-preferences.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SuperDmMessagesService } from './super-dm-messages.service';

@Module({
  imports: [
    PageSettingsModule,
    PagesModule,
    PageSettingsModule,
    PaymentsModule,
    PaymentFlowModule,
    SwapsModule,
    PageRecipientsModule,
    LwsModule,
    NotificationPreferencesModule,
    UsersModule,
    NotificationsModule,
    TypeOrmModule.forFeature([SuperDm, SuperDmMessage]),
  ],
  providers: [
    SuperDmsService,
    SuperDmSettingsService,
    SuperDmsGateway,
    SuperDmMessagesService,
  ],
  controllers: [SuperDmsController],
  exports: [SuperDmsService, SuperDmsGateway],
})
export class SuperDmsModule {}
