import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTipDto } from './dtos/create-tip.dto';
import { PagesService } from 'src/pages/pages.service';
import { LwsService } from 'src/lws/lws.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Tip } from './tip.entity';
import { In, LessThan, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { makeIntegratedAddress } from 'src/shared/utils/monero';
import { PaymentsService } from 'src/payments/payments.service';
import { MoneroUtils } from 'monero-ts';
import { ConfigService } from '@nestjs/config';
import { Payment } from 'src/payments/payment.entity';
import { TipsGateway } from './tips.gateway';
import { User } from 'src/users/user.entity';
import { UpdateTipDto } from './dtos/update-tip.dto';
import { PagesGateway } from 'src/pages/pages.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
import { SwapsService } from 'src/swaps/swaps.service';
import { Swap } from 'src/swaps/swap.entity';
import { Coin } from 'src/integrations/trocador/coin.entity';
import { TrocadorTrade } from 'src/shared/types';
import { TipMessageService } from 'src/tip-message/tip-message.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Page } from 'src/pages/page.entity';
import { PageRecipientsService } from 'src/page-recipients/page-recipients.service';

@Injectable()
export class TipsService {
  private logger = new Logger(TipsService.name);
  constructor(
    private pagesService: PagesService,
    private pagesGateway: PagesGateway,
    private lwsService: LwsService,
    private paymentsService: PaymentsService,
    private configService: ConfigService,
    private tipsGateway: TipsGateway,
    private notificationsService: NotificationsService,
    private swapsService: SwapsService,
    private tipMessageService: TipMessageService,
    private pageRecipientsService: PageRecipientsService,
    @InjectRepository(Tip) private repo: Repository<Tip>,
  ) {}

  findOneById(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  async getTipsByPageSlug(slug: string, user?: User) {
    const page = await this.pagesService.findByPath(slug);

    if (!page) throw new NotFoundException('Page is not found');

    const isStreamer = page.userId == user?.id;

    const result = await this.repo
      .createQueryBuilder('tip')
      .leftJoinAndSelect('tip.payment', 'payment')
      .leftJoinAndSelect('tip.swap', 'swap')
      .leftJoinAndSelect('swap.coin', 'coin')
      .where('tip.page_id = :pageId', { pageId: page.id })
      .andWhere('payment.paid_at IS NOT NULL')
      .orderBy('tip.created_at', 'DESC')
      .getMany();

    const privateFiltered = result.map(({ name, message, ...rest }) => {
      const hidePrivate = !isStreamer && rest.private;
      return {
        ...rest,
        name: hidePrivate ? '' : name,
        message: hidePrivate ? '' : message,
      };
    });

    return privateFiltered;
  }

  async updateTipByStreamer(id: number, payload: UpdateTipDto, user: User) {
    const tip = await this.findOneById(id);
    if (!tip) throw new NotFoundException('Tip not found');

    const page = await this.pagesService.findById(tip.pageId);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.userId != user.id) {
      throw new UnauthorizedException();
    }

    const savedTip = Object.assign(tip, payload);

    return this.repo.save(savedTip);
  }

  async createTip(payload: CreateTipDto) {
    const page = await this.pagesService.findByPath(payload.path);

    if (!page) throw new NotFoundException('Page is not found.');

    const xmrUnits = MoneroUtils.xmrToAtomicUnits(payload.amount);
    const configMin = this.configService.get('MIN_TIP_AMOUNT');

    const minTipAmountXmr = MoneroUtils.atomicUnitsToXmr(
      page.minTipAmount || configMin,
    );

    // Validate page minimum
    if (
      BigInt(xmrUnits) <
      BigInt(page.minTipAmount || this.configService.get('MIN_TIP_AMOUNT'))
    )
      throw new BadRequestException(
        `Tip amount must be more than or equal to ${minTipAmountXmr} XMR.`,
      );

    // Validate coin minimum
    if (payload.coinId) {
      const { coin, valid } = await this.swapsService.validateXmrAmount(
        parseFloat(payload.amount),
      );
      if (!valid)
        throw new BadRequestException(
          `The amount for tipping this coin should be more than ${coin.minimum} XMR.`,
        );
    }

    const { integratedAddress, paymentId } = makeIntegratedAddress(
      page.primaryAddress,
    );

    this.logger.log(
      `Tip address ${integratedAddress} - payment id: ${paymentId}`,
    );

    // Add listener webhook on lws
    let eventId = '';
    try {
      const webhook = await this.lwsService.addWebhook({
        type: 'tx-confirmation',
        address: page.primaryAddress,
        paymentId: paymentId,
        token: '',
      });
      eventId = webhook.event_id;
    } catch (error) {
      throw new BadRequestException('The page has not setup tipping yet.');
    }

    // If coin, initiate a swap

    let baseSwap: TrocadorTrade | undefined;
    let inputCoin: Coin | undefined;
    if (payload.coinId) {
      const res = await this.swapsService.initSwap({
        address: integratedAddress,
        amountTo: parseFloat(payload.amount),
        coinId: payload.coinId,
      });
      baseSwap = res.baseSwap;
      inputCoin = res.coin;
    }

    // Create and save tip record
    const createdTip = this.repo.create({
      message: payload.message,
      name: payload.name,
      private: payload.private,
      expiresAt:
        baseSwap?.details?.expiresAt || new Date(Date.now() + 60 * 60 * 1000),
      page: { id: page.id },
    });

    const tip = await this.repo.save(createdTip);

    // Create and save payment record
    await this.paymentsService.createPayment({
      eventId,
      amount: xmrUnits.toString(),
      tip: { id: tip.id },
    });

    // Save swap
    let swap: Swap | undefined;
    if (baseSwap) {
      swap = await this.swapsService.saveSwap({
        baseSwap,
        coin: inputCoin,
        tip,
      });
    }

    // Tip recipients
    const { tipRecipients, recipientsActive, url } =
      await this.pageRecipientsService.handleRecipientsAndAmounts({
        pageId: page.id,
        tipId: tip.id,
        amount: parseFloat(payload.amount),
        integratedAddress,
      });

    return {
      amount: payload.amount,
      paymentAddress: integratedAddress,
      tip,
      id: tip.id,
      swap,

      // Multi recipients
      tipRecipients: recipientsActive ? tipRecipients : [],
      url,
    };
  }

  async handleTipPayment(payment: Payment, amount: number) {
    const tip = payment.tip;

    if (!tip) {
      this.logger.warn(
        `Tip is not found on the payment with event id of ${payment.eventId}`,
      );
      return;
    }

    const page = await this.pagesService.findById(tip.pageId);

    if (!page) {
      this.logger.warn(`Page is not found on tip with id: ${tip.id}`);
      return;
    }

    // handle multi recipients, get page amount from handlePageRecipientsAndAmounts and use
    // that value to mark it as paid or not in payments service
    const amountInXmr = MoneroUtils.atomicUnitsToXmr(amount.toString());
    const pageAmount = await this.pageRecipientsService.getPageAmount(
      page.id,
      tip.id,
      amountInXmr,
    );

    const pageUnitAmount = MoneroUtils.xmrToAtomicUnits(pageAmount);

    const savedPayment = await this.paymentsService.updatePaidAmount(
      payment.id,
      amount,
      pageUnitAmount ? pageUnitAmount.toString() : undefined,
      // tip.swap ? 0.1 : 0, // threshold - accepts payment if paid amount has 0.1 less.
    );

    if (!savedPayment.isPaid()) {
      this.logger.log(
        `Tip transaction is received but is lower than expected amount ${savedPayment.amount} - Current paid amount: ${savedPayment.paidAmount} - isPaid: ${savedPayment.isPaid()}`,
      );
      this.logger.log(`Sending partial tip socket event. Tip Id ${tip.id}`);
      this.tipsGateway.notifyTipPayment(tip.id, savedPayment);
      return;
    }

    this.logger.log(`Sending tip socket event. Tip Id ${tip.id}`);
    this.tipsGateway.notifyTipPayment(tip.id, savedPayment);

    const finalMessage = await this.tipMessageService.generateMessage(
      tip.id,
      page.id,
    );

    await this.pagesGateway.notifyNewTip(page.path, tip.id);

    // send twitch message
    if (page.twitchChannel) {
      await this.notificationsService.sendTwitchMessage(
        page.twitchChannel,
        finalMessage,
      );
    }

    await this.notificationsService.handleNewTip(page.id, tip.id);

    try {
      await this.lwsService.deleteWebhook(payment.eventId);
    } catch (error) {}
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredTips() {
    const query = this.repo
      .createQueryBuilder('tip')
      .leftJoin('tip.page', 'page')
      .where(`page.expirationMinutes IS NOT NULL`)
      .andWhere(`page.expirationMinutes > 0`)
      .andWhere(
        `tip.createdAt < NOW() - (page.expirationMinutes * INTERVAL '1 minute')`,
      );

    const [res, count] = await query.getManyAndCount();

    if (count) {
      await this.repo.delete({
        id: In(res.map((t) => t.id)),
      });
      this.logger.log(`Deleted ${count} Tips.`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredWebhooks() {
    const [tips, count] = await this.repo
      .createQueryBuilder('tip')
      .leftJoinAndSelect('tip.payment', 'payment')
      .leftJoinAndSelect('tip.swap', 'swap')
      .where('payment.paidAt IS NULL')
      .andWhere('tip.webhookDeleted = false')
      .andWhere(
        `
        (CASE
          WHEN swap.id IS NOT NULL THEN tip.expires_at + interval '3 hours'
          ELSE tip.expires_at
        END) < NOW()
      `,
      )
      .getManyAndCount();

    if (!count) return;

    const expiredTips = tips.filter((tip) => tip.payment?.eventId);
    const eventIds = expiredTips.map((tip) => tip.payment.eventId);

    if (!eventIds.length) return;

    this.logger.log(
      `Deleting webhooks for ${eventIds.length} expired tips: ${eventIds}`,
    );

    try {
      await this.lwsService.deleteWebhook(eventIds);
    } catch (error) {
      this.logger.warn(
        `Failed to delete webhook for tips: ${error?.message || error}`,
      );
    }

    expiredTips.forEach((tip) => {
      tip.webhookDeleted = true;
    });

    await this.repo.save(expiredTips);
  }
}
