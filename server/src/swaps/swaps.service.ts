import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from 'src/integrations/trocador/coin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SwapsService {
  constructor(@InjectRepository(Coin) private coinRepo: Repository<Coin>) {}
  async createSwap(platform = 'trocador') {
    if (platform === 'trocador') return this.createTrocadorSwap();
    throw new BadRequestException('Swap platform is not valid');
  }

  async validateCoinAmount(coinId: number, amount: number) {
    const coin = await this.coinRepo.findOneBy({ id: coinId });
    if (!coin)
      return {
        coin: null,
        valid: false,
      };

    return {
      coin,
      valid: coin.minimum <= amount && amount >= coin.maximum,
    };
  }

  createTrocadorSwap() {}
}
