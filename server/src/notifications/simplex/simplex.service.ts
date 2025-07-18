import { Injectable } from '@nestjs/common';
import { SimplexService as SimplexIntegrationService } from 'src/integrations/simplex/simplex.service';

@Injectable()
export class SimplexService {
  constructor(
    private readonly simplexIntegrationService: SimplexIntegrationService,
  ) {}

  async sendMessage(contactId: number, message: string) {
    await this.simplexIntegrationService.sendMessage(contactId, message);
  }
}
