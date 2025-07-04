import { Module } from '@nestjs/common';
import { NotificationPreferencesService } from './notification-preferences.service';

@Module({
  providers: [NotificationPreferencesService]
})
export class NotificationPreferencesModule {}
