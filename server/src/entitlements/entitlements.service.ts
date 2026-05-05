import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class EntitlementsService {
  constructor(
    private pagesService: PagesService,
    private paymentFlowService: PaymentFlowService,
    private paymentsService: PaymentsService,
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
}
