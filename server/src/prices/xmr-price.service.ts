import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CakeService } from 'src/integrations/cake/cake.service';
@Injectable()
export class XmrPriceService {
  private logger = new Logger(XmrPriceService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
    private cakeService: CakeService,
  ) {}

  // USD
  async getMoneroUsdPrice() {
    const cachedPrice = await this.cacheManager.get('xmr-usd-price');

    if (cachedPrice) return cachedPrice;

    const priceCake = await this.getFromCake();

    if (priceCake) {
      await this.cachePrice(priceCake);
      return priceCake;
    }

    const priceCryptoCompare = await this.getFromCryptocompare();

    if (priceCryptoCompare) {
      await this.cachePrice(priceCryptoCompare);
      return priceCryptoCompare;
    }

    return 300;
  }

  async getFromCake() {
    try {
      const res =  await this.cakeService.getRate({
        quote: 'USD',
        base: 'XMR',
      });
      return res
    } catch (error) {
      this.logger.warn('Error getting price from cake');
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

  // MXN
  async getMoneroMxnPrice() {
    const cachedPrice = await this.cacheManager.get('xmr-mxn-price');

    if (cachedPrice) return cachedPrice;

    const priceCake = await this.getMxnFromCake();

    if (priceCake) {
      await this.cachePrice(priceCake, 'xmr-mxn-price');
      return priceCake;
    }

    const price = await this.getMoneroMxnPriceFromCryptocompare();

    if (price) {
      await this.cachePrice(price, 'xmr-mxn-price');
      return price;
    }

    return 0;
  }

  async getMxnFromCake() {
    try {
      return this.cakeService.getRate({
        quote: 'MXN',
        base: 'XMR',
      });
    } catch (error) {
      this.logger.warn('Error getting price from cake');
    }
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

  // EUR
  async getMoneroEurPrice() {
    const cachedPrice = await this.cacheManager.get('xmr-eur-price');

    if (cachedPrice) return cachedPrice;

    const priceCake = await this.getEurFromCake();

    if (priceCake) {
      await this.cachePrice(priceCake, 'xmr-eur-price');
      return priceCake;
    }

    const price = await this.getMoneroEurPriceFromCryptocompare();

    if (price) {
      await this.cachePrice(price, 'xmr-eur-price');
      return price;
    }

    return 0;
  }

  async getEurFromCake() {
    try {
      return this.cakeService.getRate({
        quote: 'EUR',
        base: 'XMR',
      });
    } catch (error) {
      this.logger.warn('Error getting price from cake');
    }
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
