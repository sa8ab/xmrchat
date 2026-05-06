import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { PaidContentModule } from '../paid-content.module';
import { EntitlementsModule } from 'src/entitlements/entitlements.module';
import { TelegramModule as TelegramIntegrationModule } from 'src/integrations/telegram/telegram.module';

@Module({
  imports: [PaidContentModule, EntitlementsModule, TelegramIntegrationModule],
  providers: [TelegramService],
})
export class TelegramModule {}
