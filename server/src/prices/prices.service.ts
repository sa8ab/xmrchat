import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class PricesService {
  private logger = new Logger(PricesService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {}

  async getMoneroUsdPrice() {
    const cachedPrice = await this.cacheManager.get('xmr-usd-price');

    if (cachedPrice) return cachedPrice;

    const priceLocalmonero = await this.getFromLocalmonero();

    this.logger.log({ priceLocalmonero });

    if (priceLocalmonero) {
      await this.cachePrice(priceLocalmonero);
      return priceLocalmonero;
    }

    const priceCryptoCompare = await this.getFromCryptocompare();

    this.logger.log({ priceCryptoCompare });

    if (priceCryptoCompare) {
      await this.cachePrice(priceCryptoCompare);
      return priceCryptoCompare;
    }

    return 200;
  }

  async getFromLocalmonero() {
    try {
      const { data } = await this.httpService.axiosRef.get(
        'https://localmonero.co/web/ticker?currencyCode=USD',
      );
      return data.USD?.avg_6h;
    } catch (error) {
      this.logger.log('Error getting price from localmonero');
    }
  }

  async getFromCryptocompare() {
    try {
      const { data } = await this.httpService.axiosRef.get(
        'https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=USD',
      );

      return data.USD;
    } catch (error) {
      this.logger.log('Error getting price from cryptocompare');
    }
  }

  async cachePrice(price: any) {
    await this.cacheManager.set('xmr-usd-price', price, {
      ttl: 60 * 60,
    } as any);
    return price;
  }
}
