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
    const { data } = await this.http.axiosRef.get('/v1/accounts');
    console.log(data);
    const account = data[0];
    if (!account) {
      this.logger.warn(
        'No accounts found on Signal. Scan the QR code to add an account.',
      );
      return;
    }
    this.account = account;
  }

  async sendTestMessage() {
    try {
      const { data } = await this.http.axiosRef.post('/v2/send', {
        message: 'Test message',
        number: this.account,
        recipients: [this.account],
      });
      console.log(data);
    } catch (error) {
      this.logger.error(error.response.data);
    }
  }
}
