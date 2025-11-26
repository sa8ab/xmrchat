import { Module } from '@nestjs/common';
import { SuperDmService } from './super-dm.service';
import { SuperDmController } from './super-dm.controller';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';
import { PagesModule } from 'src/pages/pages.module';

@Module({
  imports: [PageSettingsModule, PagesModule],
  providers: [SuperDmService],
  controllers: [SuperDmController],
})
export class SuperDmModule {}
