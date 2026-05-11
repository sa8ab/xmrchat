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

@Injectable()
export class EntitlementsService {
  private logger = new Logger(EntitlementsService.name);
  constructor(
    private pagesService: PagesService,
    private paymentFlowService: PaymentFlowService,
    private paymentsService: PaymentsService,
    private lwsService: LwsService,
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
    // TODO: Add tip item
    // TODO: Notifications for creating new entitlement

    try {
      await this.lwsService.deleteWebhook(payment.eventId);
    } catch (error) {}
  }
}
