import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService as TelegramIntegrationService } from 'src/integrations/telegram/telegram.service';
import { PaidContentService } from '../paid-content.service';
import { FormattedString, link } from '@grammyjs/parse-mode';
import { MoneroUtils } from 'monero-ts';
import { Context, InlineKeyboard, InputFile } from 'grammy';
import { EntitlementsService } from 'src/entitlements/entitlements.service';
import { CreateEntitlementDto } from 'src/entitlements/dto/create-entitlement.dto';
import QRCode from 'qrcode';
import { validate as uuidValidate } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PagesService } from 'src/pages/pages.service';
import { PaidContentSettingsService } from '../paid-content-settings.service';
import { PageSettingKey } from 'src/shared/constants';
import { chatMemberIs, myChatMemberFilter } from '@grammyjs/chat-members';
import { Logger } from '@nestjs/common';

@Injectable()
export class TelegramService implements OnModuleInit {
  private logger = new Logger(TelegramService.name);

  constructor(
    private telegramIntegrationService: TelegramIntegrationService,
    private paidContentService: PaidContentService,
    private entitlementsService: EntitlementsService,
    private pagesService: PagesService,
    private paidContentSettingsService: PaidContentSettingsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  onModuleInit() {
    try {
      this.init();
    } catch (error) {
      this.logger.warn('Failed to initialize telegram service', error);
    }
  }

  init() {
    const telegram = this.telegramIntegrationService.getTelegram();

    telegram.command('start', async (ctx) => {
      const match = ctx.match;

      const isUuid = uuidValidate(match);

      if (isUuid) return this.handleCreatorStart(ctx);
      else return this.handleStart(ctx);
    });

    telegram.on('callback_query:data', async (ctx) => {
      const data = ctx.callbackQuery.data;
      if (!data) {
        await ctx.answerCallbackQuery();
        return;
      }
      const [path, id] = data.split('-');
      const userId = ctx.from?.id;

      const paidContent = await this.paidContentService.findOne(Number(id));

      if (!paidContent) {
        await ctx.reply(`The item is not found.`);
        await ctx.answerCallbackQuery();
        return;
      }

      await ctx.reply(`Clicked on ${paidContent.name} for ${path}`);

      const dto: CreateEntitlementDto = {
        path,
        name: paidContent.name,
        amount: paidContent.amount,
        duration: paidContent.duration,
        type: paidContent.type,
        data: { telegramUserId: userId },
      };

      const { amount, paymentAddress } =
        await this.entitlementsService.createEntitlement(dto);

      const uri = `monero:${paymentAddress}?tx_amount=${MoneroUtils.atomicUnitsToXmr(amount)}`;

      let message = new FormattedString('');
      message = message.plain(`Please send a minimum `);
      message = message.bold(`${MoneroUtils.atomicUnitsToXmr(amount)} XMR `);
      message = message.plain(`to the following address.`);
      message = message.plain(`\n`);
      message = message.plain(`\n`);
      message = message.code(paymentAddress);

      await ctx.replyWithPhoto(new InputFile(await QRCode.toBuffer(uri)), {
        caption: message.text,
        caption_entities: message.entities,
      });

      await ctx.answerCallbackQuery();
    });

    const groups = telegram.chatType(['group', 'channel', 'supergroup']);

    groups.filter(
      myChatMemberFilter(['out', 'in'], ['admin', 'regular']),
      async (ctx: Context) => {
        return this.handleAddingMyMembers(ctx);
      },
    );
  }

  async handleStart(ctx: Context) {
    try {
      const path = ctx.match as string;
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
  }

  async handleCreatorStart(ctx: Context) {
    // Get uuid from cache
    const uuid = ctx.match as string;
    const userId = ctx.from?.id;

    if (!userId) return ctx.reply('User not found.');

    // Search with values
    const keys = await this.cacheManager.store.keys(`telegram-start-id:*`);
    let pagePath: string;

    for (const key of keys) {
      const value = await this.cacheManager.get(key);
      if (value === uuid) pagePath = key.split(':')[1];
    }

    if (!pagePath)
      return ctx.reply(
        'Please create new url from settings page. This links seems to be expired.',
      );

    // add user id to telegram user id setting
    const page = await this.pagesService.findByPath(pagePath);
    if (!page) return ctx.reply('Page not found.');

    const settings = await this.paidContentSettingsService.getSettings(
      page.user,
    );
    const telegramUserId = settings.find(
      (s) => s.key === PageSettingKey.TELEGRAM_USER_ID,
    )?.value;

    this.logger.log('telegramUserId', telegramUserId);
    if (telegramUserId)
      return ctx.reply('You have already set your telegram user to your page.');

    await this.paidContentSettingsService.updateSettings(
      { telegramUserId: userId.toString() },
      page.user,
    );

    // reply with message to add to the group as admin
    return ctx.reply(
      'You have set your telegram user to your page. Please add to your group as admin.',
    );
  }

  async handleAddingMyMembers(ctx: Context) {
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;

    const myChatMember = ctx.myChatMember?.new_chat_member;

    if (chatMemberIs(myChatMember, 'regular'))
      return ctx.reply(
        'You have added me as regular member, please promote to admin with ability to create join links.',
      );

    if (chatMemberIs(myChatMember, 'administrator')) {
      const canInviteUsers = myChatMember.can_invite_users;

      if (!canInviteUsers)
        return ctx.reply(
          'Added as adminstrator but does not have permission to invite users. Add this user as admin with permission to invite users.',
        );

      const message = 'Your fans can now join using the links.';

      const telegramUserIdSetting =
        await this.paidContentSettingsService.getTelegramUserIdByValue(
          userId.toString(),
        );

      if (!telegramUserIdSetting?.value) {
        return ctx.reply(
          'Telegram user id not found. Please create new url from settings page.',
        );
      }

      const pageId = telegramUserIdSetting.pageId;
      const page = await this.pagesService.findById(pageId);
      if (!page) {
        return ctx.reply('Page not found.');
      }

      // This is only to get user from page because we load page in findByPath.
      const pagePath = page.path;
      const pageWithUser = await this.pagesService.findByPath(pagePath);

      const settings = await this.paidContentSettingsService.getSettings(
        pageWithUser.user,
      );
      const telegramPaidContentId = settings.find(
        (s) => s.key === PageSettingKey.TELEGRAM_PAID_CONTENT_ID,
      )?.value;

      if (telegramPaidContentId) {
        return ctx.reply('You have already set your telegram group.');
      }

      await this.paidContentSettingsService.updateSettings(
        { telegramPaidContentId: chatId.toString() },
        pageWithUser.user,
      );

      return ctx.reply(message);
    }
  }
}
