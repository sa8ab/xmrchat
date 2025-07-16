import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IIntegrationVerifier } from '../integration-verifier.interface';
import { IntegrationConfig } from '../integration-configs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SignalService implements OnModuleInit, IIntegrationVerifier {
  private account: string;
  private logger = new Logger(SignalService.name);

  constructor(
    private http: HttpService,
    @InjectRepository(IntegrationConfig)
    private icRepo: Repository<IntegrationConfig>,
  ) {}

  onModuleInit() {
    this.init();
  }

  async init() {
    try {
      const { data } = await this.http.axiosRef.get('/v1/accounts');
      const account = data[0];
      if (!account) {
        this.logger.warn('No accounts found on Signal.');
        return;
      }
      this.logger.log(`Signal account: ${account}`);
      this.account = account;
    } catch (error) {
      this.logger.warn('Signal service init failed', error.response.data);
    }
  }

  async generateQrCode(name?: string) {
    if (this.account)
      throw new BadRequestException('Account already initialized.');

    const random = Math.floor(Math.random() * 100);
    name = name || `signal-cli-${random}`;
    const { data } = await this.http.axiosRef.get(`/v1/qrcodelink`, {
      responseType: 'arraybuffer',
      params: { device_name: name },
    });
    const buffer = Buffer.from(data);
    return buffer;
  }

  async sendMessage(to: string | string[], message: string) {
    if (!this.account) await this.init();
    to = Array.isArray(to) ? to : [to];
    await this.http.axiosRef.post('/v2/send', {
      message,
      number: this.account,
      recipients: to,
    });
  }

  async sendTestMessage() {
    await this.sendMessage(this.account, 'Test message');
  }

  generateCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  async requestVerification(config: IntegrationConfig): Promise<void> {
    if (!config.config.number) {
      throw new BadRequestException('Number or id not found.');
    }
    const code = this.generateCode();
    config.verificationCode = code;
    config.verificationExpiresAt = new Date(Date.now() + 1000 * 60 * 15);
    await this.icRepo.save(config);
    await this.sendMessage(
      config.config.number,
      `Your verification code is ${code}. The code will expire in 15 minutes.`,
    );
  }

  async confirmVerification(
    config: IntegrationConfig,
    candidate: string,
  ): Promise<void> {
    const { verificationCode, verificationExpiresAt } = config;
    if (!verificationCode || !verificationExpiresAt) {
      throw new BadRequestException(
        'Verification code or expires at not found.',
      );
    }

    if (verificationExpiresAt < new Date()) {
      throw new BadRequestException('Verification code expired.');
    }

    if (verificationCode !== candidate) {
      throw new BadRequestException('Invalid verification code.');
    }

    config.verified = true;
    config.verificationCode = null;
    config.verificationExpiresAt = null;
    await this.icRepo.save(config);
  }
}
