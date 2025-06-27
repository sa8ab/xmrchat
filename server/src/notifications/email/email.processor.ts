import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationsService } from '../notifications.service';
import { EmailService } from './email.service';

@Processor('notifications-email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job) {
    const data = job.data;

    if (data.type === 'send-email') {
      await this.emailService.sendEmail(data.to, data.options);
    }
  }
}
