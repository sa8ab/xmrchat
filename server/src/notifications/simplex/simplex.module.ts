import { Module } from '@nestjs/common';
import { SimplexService } from './simplex.service';

@Module({
  providers: [SimplexService]
})
export class SimplexModule {}
