import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { TemplatesService } from './templates/templates.service';
import { PageReportEmailOptions } from 'src/shared/types';
import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
  TextCensor,
} from 'obscenity';
import { Payment } from 'src/payments/payment.entity';
import { TwitchService } from './twitch/twitch.service';
import { clearMessage } from 'src/shared/utils';

const badWordMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

@Injectable()
export class NotificationsService {
  constructor(
    private emailService: EmailService,
    private templatesService: TemplatesService,
    private twitchService: TwitchService,
  ) {}

  sendVerificationEmail(to: string, otp: string) {
    const options = this.templatesService.getEmailVerification(otp);

    return this.emailService.sendEmail(to, options);
  }

  sendResetPasswordEmail(to: string, otp: string) {
    const options = this.templatesService.getResetPassword(otp);

    return this.emailService.sendEmail(to, options);
  }

  sendNewPageReportEmail(data: PageReportEmailOptions) {
    const options = this.templatesService.getPageReport(data);

    return this.emailService.sendEmail(
      // ['support@xmrchat.com', 'bwsaeed8@gmail.com'],
      ['fiatDemise@pm.me', 'bwsaeed8@gmail.com'],
      options,
    );
  }

  getTipMessage(params: {
    usdAmount: string;
    message: string;
    isPrivate: boolean;
    username: string;
  }) {
    return params.isPrivate
      ? `Private Tip: $${params.usdAmount}`
      : `${params.username} tipped $${params.usdAmount} ${params.message ? ': ' : ''} ${params.message || ''}`;
  }

  async sendTwitchMessage(channel: string, message: string) {
    await this.twitchService.sendMessage(channel, message);
  }
}
