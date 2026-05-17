import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entitlement } from './entitlement.entity';
import { Repository } from 'typeorm';
import { CreateEntitlementDto } from './dto/create-entitlement.dto';
import { PagesService } from 'src/pages/pages.service';
import { PaymentFlowService } from 'src/payment-flow/payment-flow.service';
import { MoneroUtils } from 'monero-ts';
import { PaymentsService } from 'src/payments/payments.service';
import { Payment } from 'src/payments/payment.entity';
import { LwsService } from 'src/lws/lws.service';
import { TelegramService as TelegramIntegrationService } from 'src/integrations/telegram/telegram.service';
import { getErrorMessage } from 'src/shared/utils/errors';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { PageSettingCategory, PageSettingKey } from 'src/shared/constants';
import { Page } from 'src/pages/page.entity';

@Injectable()
export class EntitlementsService {
  private logger = new Logger(EntitlementsService.name);
  constructor(
    private pagesService: PagesService,
    private paymentFlowService: PaymentFlowService,
    private paymentsService: PaymentsService,
    private lwsService: LwsService,
    private telegramService: TelegramIntegrationService,
    private pageSettingsService: PageSettingsService,
    @InjectRepository(Entitlement) private repo: Repository<Entitlement>,
  ) {}

  async createEntitlement(dto: CreateEntitlementDto) {
    const page = await this.pagesService.findByPath(dto.path);
    if (!page) throw new NotFoundException('Page is not found.');

    if (!page.isPremium)
      throw new BadRequestException(
        'Entitlement is not available for this page.',
      );

    const { eventId, integratedAddress } = await this.paymentFlowService.create(
      {
        amount: String(MoneroUtils.atomicUnitsToXmr(dto.amount)),
        page,
      },
    );

    const created = this.repo.create({
      name: dto.name,
      duration: dto.duration,
      amount: dto.amount,
      type: dto.type,
      data: dto.data,
      page: { id: page.id },
    });

    const entitlement = await this.repo.save(created);

    await this.paymentsService.createPayment({
      amount: dto.amount,
      eventId: eventId,
      entitlement: { id: entitlement.id },
    });

    return {
      amount: dto.amount,
      paymentAddress: integratedAddress,
      entitlement,
    };
  }

  async handleEntitlementPayment(payment: Payment, amount: number) {
    const entitlement = payment.entitlement;

    if (!entitlement) {
      this.logger.warn(
        `Entitlement is not found on the payment with event id of ${payment.eventId}`,
      );
      return;
    }

    const page = await this.pagesService.findById(entitlement.pageId);
    if (!page) {
      this.logger.warn(
        `Page is not found on entitlement with id: ${entitlement.id}`,
      );
      return;
    }

    const savedPayment = await this.paymentsService.updatePaidAmount(
      payment.id,
      amount,
      entitlement.amount,
    );

    if (!savedPayment.isPaid()) {
      this.logger.log(
        `Entitlement transaction is received but is lower than expected amount ${savedPayment.amount} - Current paid amount: ${savedPayment.paidAmount} - isPaid: ${savedPayment.isPaid()}`,
      );

      return;
    }

    // TODO: Send message in telegram
    await this.handleSendingTelegramMessage(entitlement, page);

    // TODO: Add tip item
    // TODO: Notifications for creating new entitlement
    // TODO: Add queue for expiration of entitlement

    try {
      await this.lwsService.deleteWebhook(payment.eventId);
    } catch (error) {}
  }

  async handleSendingTelegramMessage(entitlement: Entitlement, page: Page) {
    const telegramUserId = entitlement.data?.telegramUserId;

    if (!telegramUserId) {
      this.logger.warn(
        `Telegram user id is not found on entitlement with id: ${entitlement.id}`,
      );
      return;
    }

    const settings = await this.pageSettingsService.getByPageId(
      page.id,
      PageSettingCategory.PAID_CONTENT,
    );
    const telegramChatId = settings.find(
      (s) => s.key === PageSettingKey.TELEGRAM_PAID_CONTENT_ID,
    )?.value;

    if (!telegramChatId) {
      this.logger.warn(
        `Telegram chat id is not found on page with id: ${page.id}`,
      );
      // TODO: Send message to user also.
      return;
    }

    const telegram = this.telegramService.getTelegram();

    // create a link with the chat id, send it to the user with user id
    try {
      const inviteLink = await telegram.api.createChatInviteLink(
        telegramChatId,
        {
          name: `Join ${entitlement.name}`,
          member_limit: 1,
        },
      );

      await this.sendMessageToTelegram(
        telegramUserId,
        `Join ${entitlement.name} using the following link: ${inviteLink.invite_link}`,
      );
    } catch (error) {
      this.logger.error(
        `Error creating invite link for telegram: ${getErrorMessage(error)}`,
      );
      await this.sendMessageToTelegram(
        telegramUserId,
        `Error creating invite link for telegram: ${getErrorMessage(error)}`,
      );
    }
  }

  async sendMessageToTelegram(telegramUserId: string, message: string) {
    const telegram = this.telegramService.getTelegram();
    try {
      await telegram.api.sendMessage(telegramUserId, message);
    } catch (error) {
      this.logger.error(
        `Error sending message to telegram: ${getErrorMessage(error)}`,
      );
    }
  }
}
