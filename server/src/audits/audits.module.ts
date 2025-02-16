import { Global, Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { PageSubscriber } from './page.subscriber';

@Global()
@Module({
  providers: [AuditsService, PageSubscriber],
  exports: [AuditsService],
})
export class AuditsModule {}
