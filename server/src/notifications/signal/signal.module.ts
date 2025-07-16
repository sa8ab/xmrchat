import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { SignalModule as SignalIntegrationModule } from 'src/integrations/signal/signal.module';
import { SignalProcessor } from './signal.processor';

@Module({
  imports: [SignalIntegrationModule],
  providers: [SignalService, SignalProcessor],
})
export class SignalModule {}
