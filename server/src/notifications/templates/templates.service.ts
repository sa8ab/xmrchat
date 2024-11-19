import { Injectable } from '@nestjs/common';
import {
  emailVerificationHtml,
  resetPasswordHtml,
  newPageReportHtml,
} from './email.template';
import { PageReportEmailOptions } from 'src/shared/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TemplatesService {
  constructor(private configService: ConfigService) {}

  getEmailVerification(otp: string | number) {
    const link = `${this.configService.get('CLIENT_BASE_URL')}/auth/email_verification?token=${otp}`;
    const html = emailVerificationHtml(link);

    return {
      subject: 'XMRChat Email Verification Request',
      text: link,
      html,
    };
  }

  getResetPassword(otp: string | number) {
    const link = `${this.configService.get('CLIENT_BASE_URL')}/auth/reset_password?token=${otp}`;
    const html = resetPasswordHtml(link);

    return {
      subject: 'XMRChat Reset Password Request',
      text: link,
      html,
    };
  }

  getPageReport(data: PageReportEmailOptions) {
    const text = `Page "${data.slug}" is registered by ${data.userName}. userId: ${data.userId} and pageId: ${data.pageId}. price: ${data.price} xmr.`;
    const subject = 'XMRChat new page report';
    const html = newPageReportHtml(data);

    return {
      text,
      subject,
      html,
    };
  }
}
