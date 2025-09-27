import { Injectable } from '@nestjs/common';
import { TwitchService } from 'src/integrations/twitch/twitch.service';
import {
  LiveStreamProvider,
  LiveStreamProviderParams,
} from './live-stream-provider.interface';
import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';
import { LiveStreamPlatformEnum } from 'src/shared/constants';

@Injectable()
export class TwitchProvider implements LiveStreamProvider {
  constructor(private readonly twitchService: TwitchService) {}

  async getLiveStreams(
    params: LiveStreamProviderParams[],
  ): Promise<CreateLiveStreamDto[]> {
    if (!params.length) return [];

    try {
      const streams = await this.twitchService.getLiveStreams(
        params.map((param) => param.username),
      );

      return streams.map((stream) => ({
        title: stream.title,
        channelId: stream.user_id,
        channelName: stream.user_name,
        imageUrl: stream.thumbnail_url
          .replace('{width}', '400')
          .replace('{height}', '225'),
        platform: LiveStreamPlatformEnum.TWITCH,
        viewerCount: stream.viewer_count,
        pageId: params.find((param) => param.username === stream.user_login)
          ?.pageId,
      }));
    } catch (error) {}

    return [];
  }
}
