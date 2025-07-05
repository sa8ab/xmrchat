import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { PageReportEmailOptions } from 'src/shared/types';
import { ConfigService } from '@nestjs/config';
import { TwitchService } from 'src/integrations/twitch/twitch.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationDispatcherService } from './notification-dispatcher.service';

@Injectable()
export class NotificationsService {
  private logger = new Logger(NotificationsService.name);
  constructor(
    private emailService: EmailService,
    private twitchService: TwitchService,
    private config: ConfigService,
    private i18n: I18nService,
    private notificationDispatcherService: NotificationDispatcherService,
    @InjectQueue('notifications-email') private emailQueue: Queue,
  ) {}

  async sendTestEmail() {
    const lang = I18nContext.current?.().lang;

    await this.emailQueue.add('send-email', {
      type: 'send-email',
      to: 'bwsaeed8@gmail.com',
      options: {
        subject: this.i18n.t('email.emailVerification.subject'),
        text: 'link',
        template: 'verify-email.hbs',
        context: {
          link: 'link',
          lang,
        },
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

    return this.emailQueue.add('send-email', {
      type: 'send-email',
      to,
      options: {
        subject: this.i18n.t('email.emailVerification.subject'),
        text: link,
        template: 'verify-email.hbs',
        context: {
          link,
          lang,
        },
      },
    });
  }

  sendResetPasswordEmail(to: string, otp: string) {
    const link = `${this.config.get('CLIENT_BASE_URL')}/auth/reset_password?token=${otp}`;
    const lang = I18nContext.current?.().lang;

    return this.emailQueue.add('send-email', {
      type: 'send-email',
      to,
      options: {
        subject: this.i18n.t('email.resetPassword.subject'),
        text: link,
        template: 'reset-password.hbs',
        context: {
          link,
          lang,
        },
      },
    });
  }

  sendNewPageReportEmail(data: PageReportEmailOptions) {
    const text = `Page "${data.slug}" is registered by ${data.userName}. userId: ${data.userId} and pageId: ${data.pageId}. price: ${data.price} xmr.`;

    const recepients = this.config.get('PAGE_REPORT_RECEPIENTS').split(' ');

    return this.emailQueue.add('send-email', {
      type: 'send-email',
      to: recepients,
      options: {
        subject: 'XMRChat new page report',
        text,
        template: 'page-report.hbs',
        context: data,
      },
    });
  }

  sendSwapStatusEmail(active: boolean, reason?: string) {
    const text = active
      ? 'Swap functionality is live.'
      : `Swap functionality is disabled due to error on exchange. Reason: ${reason || ''}`;

    const recepients = this.config.get('PAGE_REPORT_RECEPIENTS').split(' ');

    return this.emailQueue.add('send-email', {
      type: 'send-email',
      to: recepients,
      options: {
        subject: `Swap status change - ${active ? 'Enabled' : 'Disabled'}`,
        text,
        html: text,
      },
    });
  }

  async sendTwitchMessage(channel: string, message: string) {
    await this.twitchService.sendMessage(channel, message);
  }

  async sendPasswordChangeEmail(to: string) {
    const lang = I18nContext.current?.().lang;

    return this.emailQueue.add('send-email', {
      type: 'send-email',
      to,
      options: {
        subject: this.i18n.t('email.passwordChange.subject'),
        text: this.i18n.t('email.passwordChange.text'),
        template: 'update-password.hbs',
        context: {
          lang,
        },
      },
    });
  }

  async handleNewTip(pageId: number, tipId: number) {
    try {
      await this.notificationDispatcherService.notifyNewTip(pageId, tipId);
    } catch (error) {
      this.logger.error(`Error notifying new tip: ${error}`);
    }
  }
}
