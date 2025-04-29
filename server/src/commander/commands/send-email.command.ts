import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { NotificationsService } from 'src/notifications/notifications.service';

@Command({
  name: 'send-email',
  description: 'Send an email',
})
export class SendEmailCommand extends CommandRunner {
  private logger = new Logger(SendEmailCommand.name);

  constructor(private readonly notificationsService: NotificationsService) {
    super();
  }

  async run(passedParam: string[], options: any) {
    this.logger.log('Sending email...');
    this.notificationsService.sendTestEmail();
  }
}
