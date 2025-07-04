import { Module } from '@nestjs/common';
import { NotificationPreferencesService } from './notification-preferences.service';
import { NotificationPreferencesController } from './notification-preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationPreference } from './notification-preferences.entity';
import { PagesModule } from 'src/pages/pages.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationPreference]), PagesModule],
  providers: [NotificationPreferencesService],
  controllers: [NotificationPreferencesController],
})
export class NotificationPreferencesModule {}
