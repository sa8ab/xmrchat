import { Module } from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swap } from './swap.entity';
import { Coin } from 'src/integrations/trocador/coin.entity';
import { TrocadorModule } from 'src/integrations/trocador/trocador.module';
import { SwapsController } from './swaps.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TrocadorModule,
    NotificationsModule,
    TypeOrmModule.forFeature([Swap, Coin]),
  ],
  providers: [SwapsService],
  exports: [SwapsService],
  controllers: [SwapsController],
})
export class SwapsModule {}
