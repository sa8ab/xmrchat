import { Module } from '@nestjs/common';
import { PageSettingsService } from './page-settings.service';
import { PageSettingsController } from './page-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageSetting } from './page-setting.entity';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [TypeOrmModule.forFeature([PageSetting]), PagesModule],
  providers: [PageSettingsService],
  controllers: [PageSettingsController],
})
export class PageSettingsModule {}
