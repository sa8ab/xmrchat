import { Module } from '@nestjs/common';
import { PageSettingsService } from './page-settings.service';
import { PageSettingsController } from './page-settings.controller';

@Module({
  providers: [PageSettingsService],
  controllers: [PageSettingsController]
})
export class PageSettingsModule {}
