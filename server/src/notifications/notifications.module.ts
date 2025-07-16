import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailModule } from './email/email.module';
import { TwitchModule } from 'src/integrations/twitch/twitch.module';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { NotificationDispatcherService } from './notification-dispatcher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/pages/page.entity';
import { User } from 'src/users/user.entity';
import { Tip } from 'src/tips/tip.entity';
import { NotificationPreference } from 'src/notification-preferences/notification-preferences.entity';
import { PageSetting } from 'src/page-settings/page-setting.entity';
import { DailySummaryProcessor } from './daily-summery.processor';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';
import { SimplexModule } from './simplex/simplex.module';
import { IntegrationConfig } from 'src/integrations/integration-configs.entity';
import { TipMessageModule } from 'src/tip-message/tip-message.module';
import { SignalModule } from './signal/signal.module';

@Module({
  imports: [
    EmailModule,
    TwitchModule,
    TipMessageModule,
    TypeOrmModule.forFeature([
      Page,
      User,
      Tip,
      NotificationPreference,
      PageSetting,
      IntegrationConfig,
    ]),
    BullModule.registerQueue({
      name: 'notifications-email',
    }),
    BullModule.registerQueue({
      name: 'notifications-simplex',
    }),
    BullModule.registerQueue({
      name: 'notifications-singal',
    }),
    BullBoardModule.forFeature({
      name: 'notifications-email',
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'notifications-simplex',
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'notifications-singal',
      adapter: BullMQAdapter,
    }),
    SimplexModule,
    SignalModule,
  ],
  providers: [
    NotificationsService,
    NotificationDispatcherService,
    DailySummaryProcessor,
  ],
  exports: [NotificationsService, NotificationDispatcherService],
})
export class NotificationsModule {}
