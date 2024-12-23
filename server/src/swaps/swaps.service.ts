import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from 'src/integrations/trocador/coin.entity';
import { TrocadorService } from 'src/integrations/trocador/trocador.service';
import { Tip } from 'src/tips/tip.entity';
import { Repository } from 'typeorm';

interface InitSwapData {
  coinId: number;
  amountTo: number;
  address: string;
  tip: Tip;
}

@Injectable()
export class SwapsService {
  constructor(
    @InjectRepository(Coin) private coinRepo: Repository<Coin>,
    private trocadorService: TrocadorService,
  ) {}
  async initSwap(data: InitSwapData, platform = 'trocador') {
    const coin = await this.coinRepo.findOneBy({ id: data.coinId });

    if (platform === 'trocador')
      return this.initTrocadorSwap({ ...data, coin });
    throw new BadRequestException('Swap platform is not valid');
  }

  async validateXmrAmount(amount: number) {
    const coin = await this.coinRepo.findOneBy({ ticker: 'xmr' });

    return {
      coin,
      valid: coin.minimum <= amount && amount <= coin.maximum,
    };
  }

  async initTrocadorSwap(data: InitSwapData & { coin: Coin }) {
    const rate = await this.trocadorService.newTrade(
      data.coin,
      data.amountTo,
      data.address,
    );
    return rate;
    // rate
    // trade
    // save swap
  }
}
