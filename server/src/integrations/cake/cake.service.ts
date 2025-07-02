import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CakeService {
  constructor(private httpService: HttpService) {}

  async getRate({ quote, base }: { quote: string; base: string }) {
    try {
      const { data } = await this.httpService.axiosRef.get('/v2/rates', {
        params: { quote, base },
      });
      const firstResult = data.results[Object.keys(data.results)[0]];
      return firstResult as number;
    } catch (error) {
      throw new BadRequestException(
        `Cake wallet API failed, make sure you have a valid API key. ${error.message}`,
      );
    }
  }
}
