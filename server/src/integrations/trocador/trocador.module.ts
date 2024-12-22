import { Module } from '@nestjs/common';
import { TrocadorService } from './trocador.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TrocadorController } from './trocador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from './coin.entity';

@Module({
  providers: [TrocadorService],
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        baseURL: config.get('TROCADOR_API_BASE_URL'),
        headers: {
          'API-Key': config.get('TROCADOR_API_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Coin]),
  ],
  controllers: [TrocadorController],
})
export class TrocadorModule {}
