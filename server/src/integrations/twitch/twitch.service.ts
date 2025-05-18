import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, client as tmiClient } from 'tmi.js';

@Injectable()
export class TwitchService {
  private logger = new Logger(TwitchService.name);

  public oauthPass = this.configService.get('TWITCH_OAUTH_PASS');

  public botName = this.configService.get('TWITCH_BOT_NAME');

  private client: Client;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.client = new tmiClient({
      channels: [],
      options: { debug: true },
      identity: {
        username: this.botName,
        password: this.oauthPass,
      },
    });

    this.connectToServer();
  }

  async connectToServer() {
    try {
      await this.client.connect();
    } catch (error) {
      console.log('Twtich connect to server error: ', error);
    }
  }

  async sendMessage(channel: string, message: string) {
    try {
      await this.client.say(channel, message);
    } catch (error) {
      this.logger.error('Sending message error', error);
    }
  }

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
