import { Module } from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swap } from './swap.entity';
import { Coin } from 'src/integrations/trocador/coin.entity';
import { TrocadorModule } from 'src/integrations/trocador/trocador.module';

@Module({
  imports: [TrocadorModule, TypeOrmModule.forFeature([Swap, Coin])],
  providers: [SwapsService],
  exports: [SwapsService],
})
export class SwapsModule {}
