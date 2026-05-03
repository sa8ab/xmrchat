import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { PaidContentService } from '../paid-content.service';
import { FormattedString } from '@grammyjs/parse-mode';
import { MoneroUtils } from 'monero-ts';
import { InlineKeyboard } from 'grammy';

@Injectable()
export class TelegramPaidContentService implements OnModuleInit {
  constructor(
    private telegramService: TelegramService,
    private paidContentService: PaidContentService,
  ) {}

  onModuleInit() {
    this.init();
  }

  init() {
    const telegram = this.telegramService.getTelegram();

    telegram.command('start', async (ctx) => {
      try {
        const path = ctx.match;
        if (!path) {
          await ctx.reply('Please start with a creator page.');
          return;
        }

        const paidContents = await this.paidContentService.findByPagePath(path);

        let message = new FormattedString('');
        message = message.plain(
          `Please select an option to get the paid content for page ${path}:\n\n`,
        );
        paidContents.forEach((item) => {
          message = message.bold(`${item.name}\n`);
          message = message.plain(`Duration: ${item.duration} days\n`);
          message = message.bold(
            `${MoneroUtils.atomicUnitsToXmr(item.amount)} XMR\n`,
          );
          if (item.description) {
            message = message.plain(`${item.description}\n`);
          }
          message = message.plain(`\n`);
        });

        const keyboard = new InlineKeyboard();
        paidContents.forEach((item) => {
          const text = `${item.name} - ${MoneroUtils.atomicUnitsToXmr(item.amount)} XMR`;
          keyboard.text(text, `${path}-${item.id}`).row();
        });

        await ctx.reply(message.text, {
          entities: message.entities,
          reply_markup: keyboard,
        });
      } catch (error) {
        console.log('error', error);

        await ctx.reply('Failed to load the paid content for this page.');
      }
    });

    telegram.start();
  }
}
