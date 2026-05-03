import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot as Telegram } from 'grammy';

@Injectable()
export class TelegramService implements OnModuleInit {
  logger = new Logger(TelegramService.name);
  private telegram: Telegram;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.init();
  }

  init() {
    const token = this.configService.get('TELEGRAM_PAID_CONTENT_TOKEN');
    if (!token) {
      this.logger.warn('TELEGRAM_PAID_CONTENT_TOKEN is not set');
      return;
    }

    this.telegram = new Telegram(token);
  }

  getTelegram() {
    if (!this.telegram)
      throw new InternalServerErrorException(
        'Telegram bot is not initialized, please add the TELEGRAM_PAID_CONTENT_TOKEN on the env.',
      );
    return this.telegram;
  }
}
