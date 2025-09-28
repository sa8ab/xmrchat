import { Injectable, Logger } from '@nestjs/common';
import { TwitchService } from 'src/integrations/twitch/twitch.service';
import {
  LiveStreamProvider,
  LiveStreamProviderParams,
} from './live-stream-provider.interface';
import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';
import { LiveStreamPlatformEnum } from 'src/shared/constants';
import { RumbleService } from 'src/integrations/rumble/rumble.service';
import { getAxiosMessage } from 'src/shared/utils/axios';

@Injectable()
export class RumbleProvider implements LiveStreamProvider {
  private logger = new Logger(RumbleProvider.name);
  constructor(private readonly rumbleService: RumbleService) {}

  async getLiveStreams(
    params: LiveStreamProviderParams[],
  ): Promise<CreateLiveStreamDto[]> {
    if (!params.length) return [];

    try {
      const streams = await this.rumbleService.getLiveStreams('');

      // return streams.map((stream) => ({
      //   title: stream.title,
      //   channelId: stream.user_id,
      //   channelName: stream.user_name,
      //   imageUrl: stream.thumbnail_url
      //     .replace('{width}', '400')
      //     .replace('{height}', '225'),
      //   platform: LiveStreamPlatformEnum.TWITCH,
      //   viewerCount: stream.viewer_count,
      //   videoId: stream.id,
      //   pageId: params.find((param) => param.username === stream.user_login)
      //     ?.pageId,
      // }));
    } catch (error) {
      this.logger.error(
        `Failed to get live streams from Rumble ${getAxiosMessage(error)}`,
      );
    }

    return [];
  }
}
