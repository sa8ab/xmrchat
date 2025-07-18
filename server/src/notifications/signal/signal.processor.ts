import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SignalService } from './signal.service';
import { Job } from 'bullmq';

@Processor('notifications-signal')
export class SignalProcessor extends WorkerHost {
  constructor(private readonly signalService: SignalService) {
    super();
  }

  async process(job: Job) {
    const data = job.data;

    if (job.name === 'send-message') {
      await this.signalService.sendMessage(data.account, data.message);
    }
  }
}
