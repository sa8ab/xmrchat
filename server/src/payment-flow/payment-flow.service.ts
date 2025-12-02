import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Coin } from 'src/integrations/trocador/coin.entity';
import { LwsService } from 'src/lws/lws.service';
import { Page } from 'src/pages/page.entity';
import { PagesService } from 'src/pages/pages.service';
import { TrocadorTrade } from 'src/shared/types';
import { makeIntegratedAddress } from 'src/shared/utils/monero';
import { SwapsService } from 'src/swaps/swaps.service';

interface CreatePaymentFlowParams {
  coinId?: number;
  amount: string;
  page: Page;
}

@Injectable()
export class PaymentFlowService {
  private logger = new Logger(PaymentFlowService.name);
  constructor(
    private pagesService: PagesService,
    private swapsService: SwapsService,
    private lwsService: LwsService,
  ) {}
  async create(params: CreatePaymentFlowParams) {
    const page = params.page;

    // Validate coin minimum
    if (params.coinId) {
      const { coin, valid } = await this.swapsService.validateXmrAmount(
        parseFloat(params.amount),
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
    if (params.coinId) {
      const res = await this.swapsService.initSwap({
        address: integratedAddress,
        amountTo: parseFloat(params.amount),
        coinId: params.coinId,
      });
      baseSwap = res.baseSwap;
      inputCoin = res.coin;
    }

    return {
      page,
      integratedAddress,
      paymentId,
      eventId,
      baseSwap,
      inputCoin,
    };
  }
}
