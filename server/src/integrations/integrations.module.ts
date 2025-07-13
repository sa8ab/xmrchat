import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { SimplexModule } from './simplex/simplex.module';
import { SignalModule } from './signal/signal.module';
import { IntegrationsController } from './integrations.controller';

@Module({
  providers: [IntegrationsService],
  imports: [SimplexModule, SignalModule],
  exports: [SimplexModule, SignalModule],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {}
