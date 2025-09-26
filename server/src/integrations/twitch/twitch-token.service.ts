import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';

@Injectable()
export class TwitchTokenService implements OnModuleInit {
  private logger = new Logger(TwitchTokenService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    const token = await this.getClientToken();
    if (token) return;
    await this.getAndSaveClientToken();
  }

  // Used for getting client credentials token
  async getClientToken() {
    const token = await this.getCachedToken();

    if (token) return token;

    return this.getAndSaveClientToken();
  }

  async validateClientToken() {
    const token = await this.getCachedToken();

    if (!token) return false;

    try {
      await this.httpService.axiosRef.get(
        'https://id.twitch.tv/oauth2/validate',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return true;
    } catch (error) {
      this.clearToken();
      return false;
    }
  }

  async getAndSaveClientToken() {
    const clientId = this.configService.get('TWITCH_CLIENT_ID');
    const clientSecret = this.configService.get('TWITCH_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      this.logger.warn(
        'TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET are not set. Twitch client credentials token can not be generated.',
      );

      return null;
    }

    try {
      const { data } = await this.httpService.axiosRef.post<{
        access_token: string;
      }>('https://id.twitch.tv/oauth2/token', {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      });

      await this.saveToken(data.access_token);

      return data.access_token;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get twitch client credentials token',
      );
    }
  }

  async getCachedToken() {
    return this.cacheManager.get<string | null>(
      'twitch-client-credentials-token',
    );
  }

  async saveToken(token: string) {
    return await this.cacheManager.set(
      'twitch-client-credentials-token',
      token,
      {
        ttl: 60 * 60, // 1 hour
      } as any,
    );
  }

  async clearToken() {
    return await this.cacheManager.del('twitch-client-credentials-token');
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async refreshToken() {
    const valid = await this.validateClientToken();

    if (valid) return;

    await this.getAndSaveClientToken();
  }
}
