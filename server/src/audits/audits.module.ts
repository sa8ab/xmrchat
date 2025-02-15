import { Global, Module } from '@nestjs/common';
import { AuditsService } from './audits.service';

@Global()
@Module({
  providers: [AuditsService],
  exports: [AuditsService],
})
export class AuditsModule {}
