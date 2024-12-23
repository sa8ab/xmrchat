import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from 'src/integrations/trocador/coin.entity';
import { TrocadorService } from 'src/integrations/trocador/trocador.service';
import { Tip } from 'src/tips/tip.entity';
import { Repository } from 'typeorm';
import { Swap } from './swap.entity';
import { TrocadorTrade } from 'src/shared/types';

interface InitSwapData {
  coinId: number;
  amountTo: number;
  address: string;
  tip: Tip;
}

@Injectable()
export class SwapsService {
  constructor(
    private trocadorService: TrocadorService,
    private configService: ConfigService,
    @InjectRepository(Coin) private coinRepo: Repository<Coin>,
    @InjectRepository(Swap) private repo: Repository<Swap>,
  ) {}
  async initSwap(data: InitSwapData, platform = 'trocador') {
    const coin = await this.coinRepo.findOneBy({ id: data.coinId });

    if (platform === 'trocador')
      return this.initTrocadorSwap({ ...data, coin });
    throw new BadRequestException('Swap platform is not valid');
  }

  async initTrocadorSwap(data: InitSwapData & { coin: Coin }) {
    const webhookBaseUrl = this.configService.get('WEBHOOK_BASE_URL');
    const trocadorWebhookToken = this.configService.get(
      'TROCADOR_WEBHOOK_TOKEN',
    );
    const webhookUrl = `${webhookBaseUrl}/webhooks/${trocadorWebhookToken}/${data.tip.id}`;

    let trade: TrocadorTrade;
    try {
      trade = await this.trocadorService.newTrade(
        data.coin,
        data.amountTo,
        data.address,
        webhookUrl,
      );
    } catch (error) {
      throw new BadRequestException('Could not create new trade.');
    }

    const created = this.repo.create({
      context: trade,
      coin: { id: data.coin.id },
      inputAmount: trade.amount_from,
      swapAddress: trade.address_provider,
      swapId: trade.trade_id,
      tip: { id: data.tip.id },
      status: '',
    });

    const swap = await this.repo.save(created);

    console.log(trade);

    return swap;
  }

  async validateXmrAmount(amount: number) {
    const coin = await this.coinRepo.findOneBy({ ticker: 'xmr' });

    return {
      coin,
      valid: coin.minimum <= amount && amount <= coin.maximum,
    };
  }
}
