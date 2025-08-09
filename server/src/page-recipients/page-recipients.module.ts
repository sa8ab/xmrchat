import { Module } from '@nestjs/common';
import { PageRecipientsService } from './page-recipients.service';

@Module({
  providers: [PageRecipientsService],
  exports: [PageRecipientsService],
})
export class PageRecipientsModule {}
