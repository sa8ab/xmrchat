import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL:
          configService.get('SIGNAL_CLI_REST_API_URL') ||
          'http://localhost:8080',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SignalService],
  exports: [SignalService],
})
export class SignalModule {}
