import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, SendMailOptions, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = createTransport(this.getConfig());
  }

  sendEmail(to: string | string[], options: SendMailOptions) {
    const from = `${this.configService.get('MAIL_FROM_NAME')} <${this.configService.get('MAIL_FROM_ADDRESS')}>`;

    return this.transporter.sendMail(
      {
        from,
        to,
        ...options,
      },
      (error) => {
        this.logger.error(`Email sending failled: ${error.message}`);
      },
    );
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
