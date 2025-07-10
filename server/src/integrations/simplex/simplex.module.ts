import { Module } from '@nestjs/common';
import { SimplexService } from './simplex.service';

@Module({
  providers: [SimplexService],
  exports: [SimplexService],
})
export class SimplexModule {}
