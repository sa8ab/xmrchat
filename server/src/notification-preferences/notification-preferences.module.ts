import { Module } from '@nestjs/common';
import { NotificationPreferencesService } from './notification-preferences.service';
import { NotificationPreferencesController } from './notification-preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationPreference } from './notification-preferences.entity';
import { PagesModule } from 'src/pages/pages.module';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreference]),
    PagesModule,
    PageSettingsModule,
  ],
  providers: [NotificationPreferencesService],
  controllers: [NotificationPreferencesController],
})
export class NotificationPreferencesModule {}
