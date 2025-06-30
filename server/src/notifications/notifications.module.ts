import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailModule } from './email/email.module';
import { TwitchModule } from 'src/integrations/twitch/twitch.module';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  providers: [NotificationsService],
  imports: [
    EmailModule,
    TwitchModule,
    BullModule.registerQueue({
      name: 'notifications-email',
    }),
    BullBoardModule.forFeature({
      name: 'notifications-email',
      adapter: BullMQAdapter,
    }),
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
