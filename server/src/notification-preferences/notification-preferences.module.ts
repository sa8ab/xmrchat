import { Module } from '@nestjs/common';
import { NotificationPreferencesService } from './notification-preferences.service';
import { NotificationPreferencesController } from './notification-preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationPreference } from './notification-preferences.entity';
import { PagesModule } from 'src/pages/pages.module';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';
import { QueuesModule } from 'src/queues/queues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreference]),
    PagesModule,
    PageSettingsModule,
    QueuesModule,
  ],
  providers: [NotificationPreferencesService],
  controllers: [NotificationPreferencesController],
  exports: [NotificationPreferencesService],
})
export class NotificationPreferencesModule {}
