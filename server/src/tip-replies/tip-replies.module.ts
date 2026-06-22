import { Module } from '@nestjs/common';
import { TipRepliesService } from './tip-replies.service';
import { TipRepliesController } from './tip-replies.controller';
import { TipsModule } from 'src/tips/tips.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipReply } from './tip-reply.entity';
import { PageSettingsModule } from 'src/page-settings/page-settings.module';
import { PagesModule } from 'src/pages/pages.module';
import { TipReplySettingsService } from './tip-reply-settings.service';

@Module({
  imports: [
    TipsModule,
    PageSettingsModule,
    PagesModule,
    TypeOrmModule.forFeature([TipReply]),
  ],
  providers: [TipRepliesService, TipReplySettingsService],
  controllers: [TipRepliesController],
})
export class TipRepliesModule {}
