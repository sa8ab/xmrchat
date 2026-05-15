import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrammyError, HttpError, Bot as Telegram } from 'grammy';
import { getErrorMessage } from 'src/shared/utils/errors';

@Injectable()
export class TelegramService implements OnModuleInit, OnApplicationBootstrap {
  logger = new Logger(TelegramService.name);
  private telegram: Telegram;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.init();
  }

  async onApplicationBootstrap() {
    try {
      await this.getTelegram().start();
    } catch (error) {
      this.logger.error('Failed to start telegram bot', getErrorMessage(error));
    }
  }

  init() {
    const token = this.configService.get('TELEGRAM_PAID_CONTENT_TOKEN');
    if (!token) {
      this.logger.warn('TELEGRAM_PAID_CONTENT_TOKEN is not set');
      return;
    }

    this.telegram = new Telegram(token);

    this.telegram.catch((err) => {
      const ctx = err.ctx;
      this.logger.error(`Error while handling update ${ctx.update.update_id}:`);
      const e = err.error;
      if (e instanceof GrammyError) {
        this.logger.error('Error in request:', e.description);
      } else if (e instanceof HttpError) {
        this.logger.error('Could not contact Telegram:', e);
      } else {
        this.logger.error('Unknown error:', e);
      }
    });
  }

  getTelegram() {
    if (!this.telegram)
      throw new InternalServerErrorException(
        'Telegram bot is not initialized, please add the TELEGRAM_PAID_CONTENT_TOKEN on the env.',
      );
    return this.telegram;
  }
}
