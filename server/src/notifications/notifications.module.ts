import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailModule } from './email/email.module';
import { TemplatesService } from './templates/templates.service';
import { TwitchModule } from './twitch/twitch.module';

@Module({
  providers: [NotificationsService, TemplatesService],
  imports: [EmailModule, TwitchModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}
