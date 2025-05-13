import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoneroUtils } from 'monero-ts';
import { Page } from 'src/pages/page.entity';
import { PricesService } from 'src/prices/prices.service';
import { FiatEnum } from 'src/shared/constants';
import { clearMessage } from 'src/shared/utils';
import { Tip } from 'src/tips/tip.entity';
import { Repository } from 'typeorm';
import Handlebars from 'handlebars';
import { FIAT_VALUES } from 'src/shared/constants/fiat';

@Injectable()
export class TipMessageService {
  constructor(
    @InjectRepository(Page) private pagesRepo: Repository<Page>,
    private pricesService: PricesService,
  ) {}

  private privateTemplate = `{{name}} tipped {{fiatValue}}`;
  private template = `{{name}} tipped {{fiatValue}} {{#if message}}: {{message}} {{/if}}`;

  async generateMessage(tip: Tip, pageId: number) {
    const message = clearMessage(tip.message);
    const page = await this.pagesRepo.findOneBy({ id: pageId });

    const fiatPrice = await this.pricesService.getMoneroPrice(
      page.fiat as FiatEnum,
    );

    const xmrValue = MoneroUtils.atomicUnitsToXmr(tip.payment.amount);

    const fiatValue = `${FIAT_VALUES[page.fiat].symbol}${(xmrValue * fiatPrice).toFixed(2)}`;

    const isPrivate = tip.private;

    const template = isPrivate ? this.privateTemplate : this.template;
    const hbTemplate = Handlebars.compile(template);

    const result = hbTemplate({
      name: tip.name,
      fiatValue: fiatValue,
      message: message,
    });

    return result;
  }
}
