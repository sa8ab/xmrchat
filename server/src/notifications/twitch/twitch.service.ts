import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
  TextCensor,
} from 'obscenity';
import { Client, client as tmiClient } from 'tmi.js';

const badWordMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

@Injectable()
export class TwitchService {
  private logger = new Logger(TwitchService.name);

  public oauthPass = this.configService.get('TWITCH_OAUTH_PASS');

  public botName = this.configService.get('TWITCH_BOT_NAME');

  private client: Client;

  constructor(private configService: ConfigService) {
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

  async sendTestMessage(channel: string, message: string) {
    try {
      await this.client.say(channel, message);
    } catch (error) {
      this.logger.error('Sending message error', error);
    }
  }

  async sendMessage(channel: string, message: string) {
    try {
      await this.client.say(channel, message);
    } catch (error) {
      this.logger.error('Sending message error', error);
    }
  }

  async connectToServer() {
    try {
      await this.client.connect();
    } catch (error) {
      console.log('Twtich connect to server error: ', error);
    }
  }

  clearMessage(message: string) {
    const censor = new TextCensor();
    const matches = badWordMatcher.getAllMatches(message);
    const clearedMessage = censor.applyTo(message, matches);

    return clearedMessage;
  }
}
