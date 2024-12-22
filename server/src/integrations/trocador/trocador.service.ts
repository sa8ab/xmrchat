import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrocadorService {
  constructor(private httpService: HttpService) {}
  async getCoins() {
    try {
      const { data } = await this.httpService.axiosRef.get('/coins');

      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
