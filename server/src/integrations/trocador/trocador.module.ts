import { Module } from '@nestjs/common';
import { TrocadorService } from './trocador.service';

@Module({
  providers: [TrocadorService]
})
export class TrocadorModule {}
