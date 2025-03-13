import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private mailer: MailerService,
  ) {}

  sendEmail(to: string | string[], options: ISendMailOptions) {
    const from = `${this.configService.get('MAIL_FROM_NAME')} <${this.configService.get('MAIL_FROM_ADDRESS')}>`;

    this.mailer
      .sendMail({
        from: from,
        to: to,
        ...options,
      })
      .catch((e) => {
        this.logger.error(`Email sending failled`, e);
      });
  }

  //   from,
  //   to,
  //   ...options,
  // }
  // (error) => {
  //   this.logger.error(`Email sending failled: ${error.message}`)
  // })

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
