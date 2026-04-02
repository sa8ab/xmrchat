import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MoneroNetworkTypeEnum, NETWORK_CONFIGS } from 'src/shared/constants';

@Injectable()
export class NetworkService {
  constructor(private configService: ConfigService) { }


  getNetworkType() {
    // TODO: Add validation for network type
    return this.configService.get<MoneroNetworkTypeEnum>('MONERO_NETWORK') || MoneroNetworkTypeEnum.MAINNET;
  }

  getNetwork() {
    return NETWORK_CONFIGS[this.getNetworkType()];
  }
}
