import { forwardRef, Module } from '@nestjs/common';
import { LwsService } from './lws.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { LwsController } from './lws.controller';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        baseURL: config.get('LWS_URL'),
      }),
      inject: [ConfigService],
    }),
    PaymentsModule,
  ],
  providers: [LwsService],
  controllers: [LwsController],
  exports: [LwsService],
})
export class LwsModule {}
