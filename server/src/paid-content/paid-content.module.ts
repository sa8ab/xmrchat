import { Module } from '@nestjs/common';
import { PaidContentService } from './paid-content.service';
import { PaidContentController } from './paid-content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaidContent } from './paid-content.entity';
import { PagesModule } from 'src/pages/pages.module';
import { PaidContentSettingsService } from './paid-content-settings.service';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaidContent]),
    PagesModule,
    PageSettingsModule,
  ],
  providers: [PaidContentService, PaidContentSettingsService],
  controllers: [PaidContentController],
  exports: [PaidContentService, PaidContentSettingsService],
})
export class PaidContentModule {}
