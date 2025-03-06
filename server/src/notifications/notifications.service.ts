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
import { ConfigService } from '@nestjs/config';

const badWordMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

@Injectable()
export class NotificationsService {
  constructor(
    private emailService: EmailService,
    private twitchService: TwitchService,
    private config: ConfigService,
  ) {}

  sendTestEmail() {
    return this.emailService.sendEmail(['bwsaeed8@gmail.com'], {
      subject: 'XMRChat new page report',
      text: 'The text',
      template: 'page-report.hbs',
      context: {
        pageId: 10,
        price: '0.001',
        slug: 'slug-of-page',
        userId: '10',
        userName: '',
        time: 'date here',
      },
    });
  }

  sendVerificationEmail(to: string, otp: string) {
    const link = `${this.config.get('CLIENT_BASE_URL')}/auth/email_verification?token=${otp}`;

    return this.emailService.sendEmail(to, {
      subject: 'XMRChat Email Verification Request',
      text: link,
      template: 'verify-email.hbs',
      context: {
        link,
      },
    });
  }

  sendResetPasswordEmail(to: string, otp: string) {
    const link = `${this.config.get('CLIENT_BASE_URL')}/auth/reset_password?token=${otp}`;

    return this.emailService.sendEmail(to, {
      subject: 'XMRChat Reset Password Request',
      text: link,
      template: 'reset-password.hbs',
      context: {
        link,
      },
    });
  }

  sendNewPageReportEmail(data: PageReportEmailOptions) {
    const text = `Page "${data.slug}" is registered by ${data.userName}. userId: ${data.userId} and pageId: ${data.pageId}. price: ${data.price} xmr.`;

    const recepients = this.config.get('PAGE_REPORT_RECEPIENTS').split(' ');

    return this.emailService.sendEmail(recepients, {
      subject: 'XMRChat new page report',
      text,
      template: 'page-report.hbs',
      context: data,
    });
  }

  sendSwapStatusEmail(active: boolean) {
    const text = active
      ? 'Swap functionality is live.'
      : 'Swap functionality is disabled due to error on exchange.';

    const recepients = this.config.get('PAGE_REPORT_RECEPIENTS').split(' ');

    return this.emailService.sendEmail(recepients, {
      subject: `Swap status change - ${active ? 'Enabled' : 'Disabled'}`,
      text,
      html: text,
    });
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

  async sendPasswordChangeEmail(to: string) {
    return this.emailService.sendEmail(to, {
      subject: 'Your XMRChat password updated.',
      text: 'Your XMRChat password updated.',
      template: 'update-password.hbs',
    });
  }
}
