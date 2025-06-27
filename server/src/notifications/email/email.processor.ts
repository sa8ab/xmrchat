import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from './email.service';
import { AuditsService } from 'src/audits/audits.service';

@Processor('notifications-email')
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly emailService: EmailService,
    private readonly auditsService: AuditsService,
  ) {
    super();
  }

  async process(job: Job) {
    const data = job.data;

    if (data.type === 'send-email') {
      await this.emailService.sendEmail(data.to, data.options);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const comment = `Email failed to send. ${job.data.to}, Subject: ${job.data.options.subject},
    Failed Reason: ${job.failedReason}`;
    this.auditsService.createLog({
      type: 'Email Failed',
      changes: {},
      tableName: '',
      comment,
    });
  }
}
