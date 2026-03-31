import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MoneroNetworkType } from 'monero-ts';
import { MoneroNetworkTypeEnum, NETWORK_CONFIGS } from 'src/shared/constants';

@Injectable()
export class NetworkService {
  constructor(private configService: ConfigService) { }


  getNetworkType() {
    return this.configService.get<MoneroNetworkTypeEnum>('MONERO_NETWORK') || MoneroNetworkType.MAINNET;
  }

  getNetwork() {
    return NETWORK_CONFIGS[this.getNetworkType()];
  }
}
