import { Module } from '@nestjs/common';
import { NotificationPreferencesService } from './notification-preferences.service';
import { NotificationPreferencesController } from './notification-preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationPreference } from './notification-preferences.entity';
import { PagesModule } from 'src/pages/pages.module';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreference]),
    PagesModule,
    PageSettingsModule,
    BullModule.registerQueue({
      name: 'notifications-daily-summary',
    }),
    BullBoardModule.forFeature({
      name: 'notifications-daily-summary',
      adapter: BullMQAdapter,
    }),
  ],
  providers: [NotificationPreferencesService],
  controllers: [NotificationPreferencesController],
})
export class NotificationPreferencesModule {}
