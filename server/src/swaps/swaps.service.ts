import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from 'src/integrations/trocador/coin.entity';
import { Tip } from 'src/tips/tip.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SwapsService {
  constructor(@InjectRepository(Coin) private coinRepo: Repository<Coin>) {}
  // coinId, amount of xmr, address, tip object,
  async initSwap(
    data: { coinId: number; amountTo: number; address: string; tip: Tip },
    platform = 'trocador',
  ) {
    if (platform === 'trocador') return this.createTrocadorSwap();
    throw new BadRequestException('Swap platform is not valid');
  }

  async validateXmrAmount(amount: number) {
    const coin = await this.coinRepo.findOneBy({ ticker: 'xmr' });
    return {
      coin,
      valid: coin.minimum <= amount && amount >= coin.maximum,
    };
  }

  createTrocadorSwap() {}
}
