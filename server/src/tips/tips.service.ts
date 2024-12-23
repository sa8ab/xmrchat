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
import { Repository } from 'typeorm';
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
import { clearMessage } from 'src/shared/utils';
import { PricesService } from 'src/prices/prices.service';
import { SwapsService } from 'src/swaps/swaps.service';

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
    private pricesService: PricesService,
    private swapsService: SwapsService,
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

    if (payload.coinId) {
      const { coin, valid } = await this.swapsService.validateXmrAmount(
        parseFloat(payload.amount),
      );
      if (!valid)
        throw new BadRequestException(
          `The amount for tipping this coin should be more than ${coin.minimum} XMR.`,
        );
    } else {
      const xmrUnits = MoneroUtils.xmrToAtomicUnits(payload.amount);

      const configMin = this.configService.get('MIN_TIP_AMOUNT');

      const minTipAmountXmr = MoneroUtils.atomicUnitsToXmr(
        page.minTipAmount || configMin,
      );

      if (
        BigInt(xmrUnits) <
        BigInt(page.minTipAmount || this.configService.get('MIN_TIP_AMOUNT'))
      )
        throw new BadRequestException(
          `Tip amount must be more than or equal to ${minTipAmountXmr} XMR.`,
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

    // Create and save tip record
    const createdTip = this.repo.create({
      message: payload.message,
      name: payload.name,
      private: payload.private,
      page: { id: page.id },
    });

    const tip = await this.repo.save(createdTip);

    // Create and save payment record
    await this.paymentsService.createPayment({
      eventId,
      amount: xmrUnits.toString(),
      tip: { id: tip.id },
    });

    // TODO: If coin, initiate a swap
    const swap = await this.swapsService.initSwap({
      address: integratedAddress,
      amountTo: parseFloat(payload.amount),
      coinId: payload.coinId,
      tip: tip,
    });

    return {
      amount: payload.amount,
      paymentAddress: integratedAddress,
      tip,
      id: tip.id,
      swap,
    };
  }

  async handleTipPayment(payment: Payment, amount: number | string) {
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

    const savedPayment = await this.paymentsService.updatePaidAmount(
      payment.id,
      amount,
    );

    if (!savedPayment.isPaid()) {
      this.logger.log(
        `Tip transaction is received but is lower than expected amount ${savedPayment.amount} - Current paid amount: ${savedPayment.paidAmount} - isPaid: ${savedPayment.isPaid()}`,
      );
      return;
    }

    this.logger.log(`Sending tip socket event. Tip Id ${tip.id}`);
    this.tipsGateway.notifyTipPayment(tip.id, savedPayment);

    const clearedMessage = clearMessage(tip.message);

    const xmrUsdPrice = await this.pricesService.getMoneroUsdPrice();

    const xmrValue = MoneroUtils.atomicUnitsToXmr(payment.amount);

    const usdValue = (xmrValue * xmrUsdPrice).toFixed(2);

    const finalMessage = this.getTipMessageText({
      isPrivate: tip.private,
      message: clearedMessage,
      usdAmount: usdValue,
      username: tip.name,
    });

    this.pagesGateway.notifyNewTip(page.path, {
      amount: savedPayment.amount,
      name: tip.name,
      message: finalMessage,
    });

    // send twitch message
    if (page.twitchChannel) {
      await this.notificationsService.sendTwitchMessage(
        page.twitchChannel,
        finalMessage,
      );
    }

    try {
      await this.lwsService.deleteWebhook(payment.eventId);
    } catch (error) {}
  }

  getTipMessageText(params: {
    usdAmount: string;
    message: string;
    isPrivate: boolean;
    username: string;
  }) {
    return params.isPrivate
      ? `Private Tip: $${params.usdAmount}`
      : `${params.username} tipped $${params.usdAmount} ${params.message ? ': ' : ''} ${params.message || ''}`;
  }
}
