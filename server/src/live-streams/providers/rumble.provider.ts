import { Injectable, Logger } from '@nestjs/common';
import { TwitchService } from 'src/integrations/twitch/twitch.service';
import {
  LiveStreamProvider,
  LiveStreamProviderParams,
} from './live-stream-provider.interface';
import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';
import { LiveStreamPlatformEnum } from 'src/shared/constants';
import {
  RumbleLivestream,
  RumbleService,
} from 'src/integrations/rumble/rumble.service';
import { getAxiosMessage } from 'src/shared/utils/axios';

@Injectable()
export class RumbleProvider implements LiveStreamProvider {
  private logger = new Logger(RumbleProvider.name);
  constructor(private readonly rumbleService: RumbleService) {}

  async getLiveStreams(
    params: LiveStreamProviderParams[],
  ): Promise<CreateLiveStreamDto[]> {
    if (!params.length) return [];

    const requests = params.map(async (param) => {
      const streams = await this.rumbleService.getLiveStreams(param.url);
      return { streams, pageId: param.pageId };
    });
    try {
      const res = await Promise.all(requests);

      const result: { pageId: number; stream: RumbleLivestream }[] = [];
      res
        .filter((r) => r.streams?.length)
        .forEach((r) => {
          r.streams.forEach((stream) => {
            result.push({
              pageId: r.pageId,
              stream,
            });
          });
        });

      return result.map(({ pageId, stream }) => ({
        title: stream.title,
        platform: LiveStreamPlatformEnum.RUMBLE,
        viewerCount: stream.watching_now,
        videoId: stream.id,
        pageId,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get live streams from Rumble ${getAxiosMessage(error)}`,
      );
    }

    return [];
  }
}
