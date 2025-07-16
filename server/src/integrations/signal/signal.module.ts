import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationConfig } from '../integration-configs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IntegrationConfig]),
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
