import { Module } from '@nestjs/common';
import { SimplexService } from './simplex.service';
import { SimplexModule as SimplexIntegrationModule } from 'src/integrations/simplex/simplex.module';
import { SimplexProcessor } from './simplex.processor';

@Module({
  imports: [SimplexIntegrationModule],
  providers: [SimplexService, SimplexProcessor],
})
export class SimplexModule {}
