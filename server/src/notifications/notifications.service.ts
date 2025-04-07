import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { PageReportEmailOptions } from 'src/shared/types';
import { ConfigService } from '@nestjs/config';
import { TwitchService } from 'src/integrations/twitch/twitch.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class NotificationsService {
  constructor(
    private emailService: EmailService,
    private twitchService: TwitchService,
    private config: ConfigService,
    private i18n: I18nService,
  ) {}

  sendTestEmail() {
    const lang = I18nContext.current?.().lang;

    return this.emailService.sendEmail('bwsaeed8@gmail.com', {
      subject: this.i18n.t('email.emailVerification.subject'),
      text: 'link',
      template: 'verify-email.hbs',
      context: {
        link: 'link',
        lang,
      },
    });

    // return this.emailService.sendEmail(['bwsaeed8@gmail.com'], {
    //   subject: 'XMRChat new page report',
    //   text: 'The text',
    //   template: 'page-report.hbs',
    //   context: {
    //     pageId: 10,
    //     price: '0.001',
    //     slug: 'slug-of-page',
    //     userId: '10',
    //     userName: '',
    //     time: 'date here',
    //     lang,
    //   },
    // });
  }

  sendVerificationEmail(to: string, otp: string) {
    const link = `${this.config.get('CLIENT_BASE_URL')}/auth/email_verification?token=${otp}`;
    const lang = I18nContext.current?.().lang;

    return this.emailService.sendEmail(to, {
      subject: this.i18n.t('email.emailVerification.subject'),
      text: link,
      template: 'verify-email.hbs',
      context: {
        link,
        lang,
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

  sendSwapStatusEmail(active: boolean, reason?: string) {
    const text = active
      ? 'Swap functionality is live.'
      : `Swap functionality is disabled due to error on exchange. Reason: ${reason || ''}`;

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
