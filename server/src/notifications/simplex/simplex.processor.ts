import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SimplexService } from './simplex.service';
import { Job } from 'bullmq';

@Processor('notifications-simplex')
export class SimplexProcessor extends WorkerHost {
  constructor(private readonly simplexService: SimplexService) {
    super();
  }

  async process(job: Job) {
    const data = job.data;

    if (job.name === 'send-message') {
      await this.simplexService.sendMessage(data.contactId, data.message);
    }
  }
}
