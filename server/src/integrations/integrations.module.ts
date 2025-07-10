import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { SimplexModule } from './simplex/simplex.module';

@Module({
  providers: [IntegrationsService],
  imports: [SimplexModule],
  exports: [SimplexModule],
})
export class IntegrationsModule {}
