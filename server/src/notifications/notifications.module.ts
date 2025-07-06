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

@Module({
  imports: [
    EmailModule,
    TwitchModule,
    TypeOrmModule.forFeature([
      Page,
      User,
      Tip,
      NotificationPreference,
      PageSetting,
    ]),
    BullModule.registerQueue({
      name: 'notifications-email',
    }),
    BullBoardModule.forFeature({
      name: 'notifications-email',
      adapter: BullMQAdapter,
    }),
  ],
  providers: [NotificationsService, NotificationDispatcherService],
  exports: [NotificationsService, NotificationDispatcherService],
})
export class NotificationsModule {}
