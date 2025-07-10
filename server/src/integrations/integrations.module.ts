import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { SimplexModule } from './simplex/simplex.module';
import { SignalModule } from './signal/signal.module';

@Module({
  providers: [IntegrationsService],
  imports: [SimplexModule, SignalModule],
  exports: [SimplexModule],
})
export class IntegrationsModule {}
