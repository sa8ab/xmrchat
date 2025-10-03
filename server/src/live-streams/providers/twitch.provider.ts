import { Injectable, Logger } from '@nestjs/common';
import { TwitchService } from 'src/integrations/twitch/twitch.service';
import {
  LiveStreamProvider,
  LiveStreamProviderParams,
} from './live-stream-provider.interface';
import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';
import { LiveStreamPlatformEnum } from 'src/shared/constants';

@Injectable()
export class TwitchProvider implements LiveStreamProvider {
  private logger = new Logger(TwitchProvider.name);
  constructor(private readonly twitchService: TwitchService) {}

  async getLiveStreams(
    params: LiveStreamProviderParams[],
  ): Promise<CreateLiveStreamDto[]> {
    if (!params.length) return [];

    try {
      const streams = await this.twitchService.getLiveStreams(
        params
          .filter((param) => Boolean(param.username))
          .map((param) => param.username),
      );

      const paramsWithStreams = params
        .map((param) => {
          const stream = streams.find(
            (stream) =>
              stream.user_login.toLowerCase() === param.username.toLowerCase(),
          );
          return {
            param,
            stream,
          };
        })
        .filter((page) => Boolean(page.stream));

      return paramsWithStreams.map(({ stream, param: { pageId } }) => ({
        title: stream.title,
        channelId: stream.user_id,
        channelName: stream.user_name,
        imageUrl: stream.thumbnail_url
          .replace('{width}', '400')
          .replace('{height}', '225'),
        platform: LiveStreamPlatformEnum.TWITCH,
        viewerCount: stream.viewer_count,
        videoId: stream.id,
        pageId,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get live streams from Twitch: ${error.message}`,
      );
    }

    return [];
  }
}
