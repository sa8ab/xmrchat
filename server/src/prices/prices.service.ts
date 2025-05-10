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

  // Monero

  async getMoneroPrices() {
    const xmrUsdPrice = await this.getMoneroUsdPrice();

    return {
      usd: xmrUsdPrice,
      mxn: 6158,
    };
  }

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

  // Litecoin
  async getLitecoinUsdPrice() {
    const cachedPrice = await this.cacheManager.get('ltc-usd-price');

    if (cachedPrice) return cachedPrice;

    const priceDiadata = await this.getFromLocalmonero();

    if (priceDiadata) {
      await this.cachePrice(priceDiadata, 'ltc-usd-price');
      return priceDiadata;
    }

    return 100;
  }

  async getLtcFromDiadata() {
    try {
      const { data } = await this.httpService.axiosRef.get(
        'https://api.diadata.org/v1/assetQuotation/Litecoin/0x0000000000000000000000000000000000000000',
      );
      return data.price as number;
    } catch (error) {
      this.logger.warn('Error getting ltc price from ');
    }
  }

  async cachePrice(price: any, key: string = 'xmr-usd-price') {
    await this.cacheManager.set(key, price, {
      ttl: 60 * 60,
    } as any);
    return price;
  }
}
