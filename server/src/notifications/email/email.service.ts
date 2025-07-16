import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private mailer: MailerService,
  ) {}

  async sendEmail(to: string | string[], options: ISendMailOptions) {
    const from = `${this.configService.get('MAIL_FROM_NAME')} <${this.configService.get('MAIL_FROM_ADDRESS')}>`;

    try {
      await this.mailer.sendMail({
        from: from,
        to: to,
        ...options,
      });
    } catch (error) {
      this.logger.error(`Email sending failled`, error);
      throw error;
    }
  }

  getConfig() {
    const isDev = process.env.NODE_ENV === 'development';

    const host = isDev ? '0.0.0.0' : this.configService.get('MAIL_HOST');

    const auth = isDev
      ? {}
      : {
          user: this.configService.get('MAIL_USERNAME'),
          pass: this.configService.get('MAIL_PASSWORD'),
        };
    const port = isDev ? 1025 : undefined;

    const ignoreTLS = isDev ? false : true;

    return { host, auth, port, ignoreTLS };
  }
}
