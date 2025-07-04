import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';

@Module({
  providers: [IntegrationsService]
})
export class IntegrationsModule {}
