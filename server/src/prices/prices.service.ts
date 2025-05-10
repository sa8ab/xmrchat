import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { XmrPriceService } from './xmr-price.service';
import { FiatEnum } from 'src/shared/constants';

@Injectable()
export class PricesService {
  constructor(private xmrPriceService: XmrPriceService) {}

  // Monero
  async getMoneroPrices() {
    const xmrUsdPrice = await this.xmrPriceService.getMoneroUsdPrice();
    const xmrMxnPrice = await this.xmrPriceService.getMoneroMxnPrice();
    const xmrEurPrice = await this.xmrPriceService.getMoneroEurPrice();

    return {
      usd: xmrUsdPrice,
      mxn: xmrMxnPrice,
      eur: xmrEurPrice,
    };
  }

  async getMoneroPrice(fiat: FiatEnum = FiatEnum.USD) {
    const prices = await this.getMoneroPrices();
    if (prices[fiat]) return prices[fiat];
    return 0;
  }

  // Litecoin
  // async getLitecoinUsdPrice() {
  //   const cachedPrice = await this.cacheManager.get('ltc-usd-price');

  //   if (cachedPrice) return cachedPrice;

  //   const priceDiadata = await this.getLtcFromDiadata();

  //   if (priceDiadata) {
  //     await this.cachePrice(priceDiadata, 'ltc-usd-price');
  //     return priceDiadata;
  //   }

  //   return 100;
  // }

  // async getLtcFromDiadata() {
  //   try {
  //     const { data } = await this.httpService.axiosRef.get(
  //       'https://api.diadata.org/v1/assetQuotation/Litecoin/0x0000000000000000000000000000000000000000',
  //     );
  //     return data.price as number;
  //   } catch (error) {
  //     this.logger.warn('Error getting ltc price from ');
  //   }
  // }
}
