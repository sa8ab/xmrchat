import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitchService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}
  async channelExists(channel: string) {
    const accessToken = this.configService.get(
      'TWITCH_IMPLICIT_FLOW_ACCESS_TOKEN',
    );
    const clientId = this.configService.get('TWITCH_CLIENT_ID');

    try {
      const res = await this.httpService.axiosRef.get(
        `https://api.twitch.tv/helix/users?login=${channel}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.twitchtv.v5+json',
            'Client-ID': clientId,
          },
        },
      );
      if (res.data.data.length >= 1) return true;
      return false;
    } catch (error) {
      console.log(
        'Twitch api error on getting channel name',
        error.response?.data,
      );
      if (error?.response?.data?.status === 403) return true;
      return false;
    }
  }
}
