import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class XmrPriceService {
  private logger = new Logger(XmrPriceService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {}

  // Monero
  async getMoneroUsdPrice() {
    const cachedPrice = await this.cacheManager.get('xmr-usd-price');

    if (cachedPrice) return cachedPrice;

    const priceLocalmonero = await this.getFromLocalmonero();

    if (priceLocalmonero) {
      await this.cachePrice(priceLocalmonero);
      return priceLocalmonero;
    }

    const priceCryptoCompare = await this.getFromCryptocompare();

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
      this.logger.warn('Error getting price from localmonero');
    }
  }

  async getFromCryptocompare() {
    try {
      const { data } = await this.httpService.axiosRef.get(
        'https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=USD',
      );

      return data.USD;
    } catch (error) {
      this.logger.warn('Error getting price from cryptocompare');
    }
  }

  async getMoneroMxnPrice() {
    const cachedPrice = await this.cacheManager.get('xmr-mxn-price');

    if (cachedPrice) return cachedPrice;

    const price = await this.getMoneroMxnPriceFromCryptocompare();

    if (price) {
      await this.cachePrice(price, 'xmr-mxn-price');
      return price;
    }

    return 0;
  }

  async getMoneroMxnPriceFromCryptocompare() {
    try {
      const { data } = await this.httpService.axiosRef.get(
        'https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=MXN',
      );

      return data.MXN;
    } catch (error) {
      this.logger.warn('Error getting price from cryptocompare');
    }
  }

  async getMoneroEurPrice() {
    const cachedPrice = await this.cacheManager.get('xmr-eur-price');

    if (cachedPrice) return cachedPrice;

    const price = await this.getMoneroEurPriceFromCryptocompare();

    if (price) {
      await this.cachePrice(price, 'xmr-eur-price');
      return price;
    }

    return 0;
  }

  async getMoneroEurPriceFromCryptocompare() {
    try {
      const { data } = await this.httpService.axiosRef.get(
        'https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=EUR',
      );

      return data.EUR;
    } catch (error) {
      this.logger.warn('Error getting price from cryptocompare');
    }
  }

  async cachePrice(price: any, key: string = 'xmr-usd-price') {
    await this.cacheManager.set(key, price, {
      ttl: 60 * 60,
    } as any);
    return price;
  }
}
