import { Module } from '@nestjs/common';
import { SwapsService } from './swaps.service';

@Module({
  providers: [SwapsService]
})
export class SwapsModule {}
