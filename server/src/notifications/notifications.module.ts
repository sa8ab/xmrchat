import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailModule } from './email/email.module';
import { TwitchModule } from 'src/integrations/twitch/twitch.module';
import { NotificationDispatcherService } from './notification-dispatcher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/pages/page.entity';
import { User } from 'src/users/user.entity';
import { Tip } from 'src/tips/tip.entity';
import { NotificationPreference } from 'src/notification-preferences/notification-preferences.entity';
import { PageSetting } from 'src/page-settings/page-setting.entity';
import { DailySummaryProcessor } from './daily-summery.processor';
import { SimplexModule } from './simplex/simplex.module';
import { IntegrationConfig } from 'src/integrations/integration-configs.entity';
import { TipMessageModule } from 'src/tip-message/tip-message.module';
import { SignalModule } from './signal/signal.module';
import { NotificationTestsService } from './notification-tests.service';
import { QueuesModule } from 'src/queues/queues.module';

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
    QueuesModule,
    SimplexModule,
    SignalModule,
  ],
  providers: [
    NotificationsService,
    NotificationDispatcherService,
    DailySummaryProcessor,
    NotificationTestsService,
  ],
  exports: [
    NotificationsService,
    NotificationDispatcherService,
    NotificationTestsService,
  ],
})
export class NotificationsModule {}
