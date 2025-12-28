import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { TwitchTokenService } from 'src/integrations/twitch/twitch-token.service';
import { LiveStreamsService } from 'src/live-streams/live-streams.service';

@Command({
  name: 'config',
  arguments: '<config>',
  description: 'Updates configs',
})
export class ConfigCommand extends CommandRunner {
  private logger = new Logger(ConfigCommand.name);

  constructor(
    private twitchTokenService: TwitchTokenService,
    private liveStreamsService: LiveStreamsService,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const config = passedParams[0];

    if (config === 'get-twitch-token') {
      await this.updateTwitchToken();
      return;
    }
    if (config === 'validate-twitch-token') {
      await this.validateTwitchToken();
      return;
    }
    if (config === 'refresh-twitch-token') {
      await this.refreshTwitchToken();
      return;
    }
    if (config === 'update-live-streams') {
      await this.updateLiveStreams();
      return;
    }

    if (config === 'update-youtube-live-streams') {
      await this.updateYoutubeLiveStreams();
      return;
    }

    this.logger.error(`Parameter is invalid: ${config}`);
  }

  async updateTwitchToken() {
    this.logger.log('updating twitch token');
    const token = await this.twitchTokenService.getAndSaveClientToken();
    console.log(token);
  }
  async validateTwitchToken() {
    this.logger.log('verifying twitch token');
    const token = await this.twitchTokenService.validateClientToken();
    console.log(token);
  }
  async refreshTwitchToken() {
    this.logger.log('refreshing twitch token');
    await this.twitchTokenService.refreshToken();
  }

  async updateLiveStreams() {
    this.logger.log('updating live streams');
    await this.liveStreamsService.getAndUpdateLiveStreams();
    this.logger.log('live streams updated');
  }

  async updateYoutubeLiveStreams() {
    this.logger.log('updating youtube live streams');
    await this.liveStreamsService.getYoutubeLiveStreams();
  }
}
