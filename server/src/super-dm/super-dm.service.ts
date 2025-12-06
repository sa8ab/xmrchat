import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { PagesService } from 'src/pages/pages.service';
import { CreateSuperDmDto } from './dto/create-super-dm.dto';
import { ConfigService } from '@nestjs/config';
import { PageSettingKey } from 'src/shared/constants';
import { MoneroUtils } from 'monero-ts';
import { PaymentFlowService } from 'src/payment-flow/payment-flow.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperDm } from './super-dm.entity';
import { Repository } from 'typeorm';
import { PaymentsService } from 'src/payments/payments.service';
import { Swap } from 'src/swaps/swap.entity';
import { SwapsService } from 'src/swaps/swaps.service';
import { PageRecipientsService } from 'src/page-recipients/page-recipients.service';
import { Payment } from 'src/payments/payment.entity';

@Injectable()
export class SuperDmService {
  private logger = new Logger(SuperDmService.name);

  constructor(
    private pageSettingsService: PageSettingsService,
    private pagesService: PagesService,
    private configService: ConfigService,
    private paymentFlowService: PaymentFlowService,
    private paymentsService: PaymentsService,
    private swapsService: SwapsService,
    private pageRecipientsService: PageRecipientsService,
    @InjectRepository(SuperDm) private repo: Repository<SuperDm>,
  ) {}

  async createSuperDm(dto: CreateSuperDmDto) {
    const page = await this.pagesService.findByPath(dto.path);
    if (!page) throw new NotFoundException('Page is not found.');

    await this.validateMinSuperDmAmount(page.path, dto.amount);

    const { baseSwap, eventId, inputCoin, integratedAddress } =
      await this.paymentFlowService.create({
        amount: String(MoneroUtils.atomicUnitsToXmr(dto.amount)),
        page,
        coinId: dto.coinId,
      });

    const created = this.repo.create({
      name: dto.name,
      publicKey: dto.publicKey,
      expiresAt:
        baseSwap?.details?.expiresAt || new Date(Date.now() + 60 * 60 * 1000),
      page: { id: page.id },
    });
    const superDm = await this.repo.save(created);

    await this.paymentsService.createPayment({
      amount: dto.amount,
      eventId: eventId,
      superDm: { id: superDm.id },
    });

    // Save swap
    let swap: Swap | undefined;
    if (baseSwap) {
      swap = await this.swapsService.saveSwap({
        baseSwap,
        coin: inputCoin,
        superDm,
      });
    }

    const { recipients, url } =
      await this.pageRecipientsService.handleRecipientsAndAmounts({
        pageId: page.id,
        swapId: swap?.id,
        amount: MoneroUtils.atomicUnitsToXmr(dto.amount),
        integratedAddress,
      });

    return {
      amount: dto.amount,
      paymentAddress: integratedAddress,
      superDm,
      swap,
      recipients,
      url,
    };
  }

  async validateMinSuperDmAmount(pagePath: string, dtoAmount: string) {
    const configMin = this.configService.get<string>('MIN_TIP_AMOUNT');
    const pageMin = await this.pageSettingsService.getSettingValue<string>(
      pagePath,
      PageSettingKey.SUPER_DM_MIN_AMOUNT,
    );
    const min = pageMin || configMin;
    const minBig = BigInt(min);
    const dtoBig = BigInt(dtoAmount);

    if (dtoBig < minBig)
      throw new BadRequestException(
        `Amount must be greater than ${MoneroUtils.atomicUnitsToXmr(min)} XMR.`,
      );
  }

  async handleSuperDmPayment(payment: Payment, amount: number) {
    const superDm = payment.superDm;

    if (!superDm) {
      this.logger.warn(
        `Super DM is not found on the payment with event id of ${payment.eventId}`,
      );
      return;
    }

    const page = await this.pagesService.findById(superDm.pageId);

    if (!page) {
      this.logger.warn(`Page is not found on super dm with id: ${superDm.id}`);
      return;
    }
    const amountInXmr = MoneroUtils.atomicUnitsToXmr(amount.toString());
    const pageAmount = await this.pageRecipientsService.getPageAmount({
      pageId: page.id,
      swapId: superDm.swapId,
      amount: amountInXmr,
    });

    const pageUnitAmount = MoneroUtils.xmrToAtomicUnits(pageAmount);

    const savedPayment = await this.paymentsService.updatePaidAmount(
      payment.id,
      amount,
      pageUnitAmount ? pageUnitAmount.toString() : undefined,
      // tip.swap ? 0.1 : 0, // threshold - accepts payment if paid amount has 0.1 less.
    );

    if (!savedPayment.isPaid()) {
      this.logger.log(
        `Super DM transaction is received but is lower than expected amount ${savedPayment.amount} - Current paid amount: ${savedPayment.paidAmount} - isPaid: ${savedPayment.isPaid()}`,
      );
      this.logger.log(
        `Sending partial super dm socket event. Super DM Id ${superDm.id}`,
      );
      return;
    }
  }

  // get list of super dms for page - needs signature
  // get a super dm by id
  // end super dm
}
