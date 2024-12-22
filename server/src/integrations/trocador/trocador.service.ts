import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from './coin.entity';
import { Repository } from 'typeorm';

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
}
