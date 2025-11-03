import { Module } from '@nestjs/common';
import { PageSettingsService } from './page-settings.service';
import { PageSettingsController } from './page-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageSetting } from './page-setting.entity';
import { PagesModule } from '../pages/pages.module';
import { File } from 'src/files/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PageSetting, File]), PagesModule],
  providers: [PageSettingsService],
  controllers: [PageSettingsController],
  exports: [PageSettingsService],
})
export class PageSettingsModule {}
