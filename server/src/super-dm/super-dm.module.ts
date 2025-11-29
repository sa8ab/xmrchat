import { Module } from '@nestjs/common';
import { SuperDmService } from './super-dm.service';
import { SuperDmController } from './super-dm.controller';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';
import { PagesModule } from 'src/pages/pages.module';
import { SuperDmSettingsService } from './super-dm-settings.service';

@Module({
  imports: [PageSettingsModule, PagesModule],
  providers: [SuperDmService, SuperDmSettingsService],
  controllers: [SuperDmController],
})
export class SuperDmModule {}
