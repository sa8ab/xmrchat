import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramPaidContentService } from './telegram-paid-content.service';
import { PaidContentModule } from '../paid-content.module';

@Module({
  imports: [PaidContentModule],
  providers: [TelegramService, TelegramPaidContentService],
})
export class TelegramModule {}
