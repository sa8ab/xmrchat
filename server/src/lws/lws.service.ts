import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class LwsService {
  private logger = new Logger(LwsService.name);

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getAccounts() {
    try {
      const { data } = await this.httpService.axiosRef.post(
        '/list_accounts',
        {},
      );

      console.log(data);
      return data;
    } catch (error) {
      console.log(error.response);
    }
  }

  async addAccount(payload: { address: string; key: string }) {
    const { data } = await this.httpService.axiosRef.post('/add_account', {
      params: payload,
    });

    return data;
  }

  async addWebhook(payload: {
    type: string;
    url?: string;
    paymentId: string;
    token: string;
    address: string;
  }) {
    await new Promise((r) => setTimeout(() => r(''), 20));
    const url =
      payload.url ||
      `${this.configService.get('LWS_WEBHOOK_URL')}/${this.configService.get('LWS_WEBHOOK_TOKEN')}`;

    const { data } = await this.httpService.axiosRef.post('/webhook_add', {
      params: {
        type: payload.type,
        url,
        payment_id: payload.paymentId,
        token: payload.token,
        address: payload.address,
      },
    });

    return data;
  }

  async listWebhooks() {
    try {
      const { data } = await this.httpService.axiosRef.post(
        '/webhook_list',
        {},
      );
      return data;
    } catch (error) {
      console.log(error.response);
    }
  }

  async deleteWebhook(eventId: string) {
    const { data } = await this.httpService.axiosRef.post(
      '/webhook_delete_uuid',
      {
        params: { event_ids: [eventId] },
      },
    );

    return data;
  }

  async deleteAddressWebhooks(address: string) {
    try {
      const { data } = await this.httpService.axiosRef.post('/webhook_delete', {
        params: { addresses: [address] },
      });
      return data;
    } catch (error) {
      console.log(error.response);
      throw new BadRequestException('Webhook deletion failed');
    }
  }

  async listRequests() {
    try {
      const { data } = await this.httpService.axiosRef.post(
        '/list_requests',
        {},
      );
      return data;
    } catch (error) {
      console.log(error.response);
    }
  }
}
