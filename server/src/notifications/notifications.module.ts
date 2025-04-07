import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailModule } from './email/email.module';
import { TwitchModule } from 'src/integrations/twitch/twitch.module';

@Module({
  providers: [NotificationsService],
  imports: [EmailModule, TwitchModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}
