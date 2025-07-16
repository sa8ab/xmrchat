import { Global, Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { PageSubscriber } from './page.subscriber';
import { TipSubscriber } from './tip.subscriber';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tip } from 'src/tips/tip.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Tip])],
  providers: [AuditsService, PageSubscriber, TipSubscriber],
  exports: [AuditsService, PageSubscriber, TipSubscriber],
})
export class AuditsModule {}
