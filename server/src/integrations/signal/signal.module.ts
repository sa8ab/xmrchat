import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';

@Module({
  providers: [SignalService]
})
export class SignalModule {}
