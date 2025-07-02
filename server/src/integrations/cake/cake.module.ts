import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CakeService } from './cake.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('CAKE_WALLET_FIAT_API_BASE_URL'),
        headers: {
          'X-API-KEY': configService.get('CAKE_WALLET_FIAT_API_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CakeService],
  exports: [CakeService],
})
export class CakeModule {}
