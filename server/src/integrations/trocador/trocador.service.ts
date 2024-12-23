import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from './coin.entity';
import { Repository } from 'typeorm';
import { TrocadorTrade } from 'src/shared/types';

@Injectable()
export class TrocadorService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Coin) private repo: Repository<Coin>,
  ) {}
  async getCoinsApi() {
    try {
      const { data } = await this.httpService.axiosRef.get<Coin[]>('/coins');

      return data;
    } catch (error) {
      console.log(error.response);
    }
  }

  async getAndSaveCoins() {
    const coins = await this.getCoinsApi();

    if (!coins)
      throw new BadRequestException('Could not get coins from trocador!');

    await this.repo.upsert(coins, ['name', 'ticker']);
    return coins;
  }

  async newRate(coin: Coin, amount: number) {
    try {
      const { data } = await this.httpService.axiosRef.get('/new_rate', {
        params: {
          ticker_from: coin.ticker,
          network_from: coin.network,
          ticker_to: 'xmr',
          network_to: 'Mainnet',
          amount_to: amount,
          payment: true,
          best_only: true,
        },
      });
      console.log('new_rate:', data);
      return data;
    } catch (error) {
      console.log(error.response.data.error);
      throw new Error(error.response.data.error);
    }
  }

  async newTrade(coin: Coin, amount: number, address: string) {
    try {
      const { data } = await this.httpService.axiosRef.get<TrocadorTrade>(
        '/new_trade',
        {
          params: {
            ticker_from: coin.ticker,
            network_from: coin.network,
            ticker_to: 'xmr',
            network_to: 'Mainnet',
            amount_to: amount,
            address: address,
            payment: true,
          },
        },
      );

      return data;
    } catch (error) {
      console.log(error.response.data.error);
      throw new Error(error.response.data.error);
    }
  }
}
