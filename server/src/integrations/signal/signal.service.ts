import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SignalService implements OnModuleInit {
  private account: string;
  private logger = new Logger(SignalService.name);

  constructor(private http: HttpService) {}

  onModuleInit() {
    this.init();
  }

  async init() {
    try {
      const { data } = await this.http.axiosRef.get('/v1/accounts');
      const account = data[0];
      if (!account) {
        this.logger.warn(
          'No accounts found on Signal. Scan the QR code to add an account.',
        );
        return;
      }
      this.logger.log(`Signal account: ${account}`);
      this.account = account;
    } catch (error) {
      this.logger.warn('Signal service init failed', error.response.data);
    }
  }

  async sendMessage(to: string | string[], message: string) {
    to = Array.isArray(to) ? to : [to];
    try {
      await this.http.axiosRef.post('/v2/send', {
        message,
        number: this.account,
        recipients: to,
      });
    } catch (error) {
      this.logger.error(error.response.data);
    }
  }

  async sendTestMessage() {
    await this.sendMessage(this.account, 'Test message');
  }
}
