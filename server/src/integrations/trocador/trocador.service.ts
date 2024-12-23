import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from './coin.entity';
import { Repository } from 'typeorm';
import { InitSwapData, TrocadorTrade } from 'src/shared/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrocadorService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
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

  async newTrade(coin: Coin, amount: number, address: string, webhook: string) {
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
            webhook,
          },
        },
      );

      return data;
    } catch (error) {
      console.log(error);

      throw new Error(error.response?.data.error);
    }
  }

  async initSwap(data: InitSwapData & { coin: Coin }) {
    const webhookBaseUrl = this.configService.get('WEBHOOK_BASE_URL');
    const trocadorWebhookToken = this.configService.get(
      'TROCADOR_WEBHOOK_TOKEN',
    );
    const webhookUrl = `${webhookBaseUrl}/webhooks/trocator/${trocadorWebhookToken}/${data.tip.id}`;

    const trade = await this.newTrade(
      data.coin,
      data.amountTo,
      data.address,
      webhookUrl,
    );
    return trade;
  }
}
