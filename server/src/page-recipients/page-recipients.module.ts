import { Module } from '@nestjs/common';
import { PageRecipientsService } from './page-recipients.service';
import { PageRecipientsController } from './page-recipients.controller';

@Module({
  providers: [PageRecipientsService],
  exports: [PageRecipientsService],
  controllers: [PageRecipientsController],
})
export class PageRecipientsModule {}
