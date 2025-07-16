import { Injectable } from '@nestjs/common';
import { SignalService as SignalIntegrationService } from 'src/integrations/signal/signal.service';

@Injectable()
export class SignalService {
  constructor(private signalIntegrationService: SignalIntegrationService) {}

  async sendMessage(account: string, message: string) {
    return this.signalIntegrationService.sendMessage(account, message);
  }
}
