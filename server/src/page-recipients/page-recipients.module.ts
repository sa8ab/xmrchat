import { Module } from '@nestjs/common';
import { PageRecipientsService } from './page-recipients.service';
import { PageRecipientsController } from './page-recipients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageRecipient } from './page-recipient.entity';
import { PagesModule } from 'src/pages/pages.module';
import { Page } from 'src/pages/page.entity';

@Module({
  providers: [PageRecipientsService],
  imports: [TypeOrmModule.forFeature([PageRecipient, Page]), PagesModule],
  exports: [PageRecipientsService],
  controllers: [PageRecipientsController],
})
export class PageRecipientsModule {}
