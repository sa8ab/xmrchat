import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramPaidContentService } from './telegram-paid-content.service';
import { PaidContentModule } from '../paid-content.module';
import { EntitlementsModule } from 'src/entitlements/entitlements.module';

@Module({
  imports: [PaidContentModule, EntitlementsModule],
  providers: [TelegramService, TelegramPaidContentService],
})
export class TelegramModule {}
