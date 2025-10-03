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
      const settled = await Promise.allSettled(requests);

      const res = settled
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);

      const errors = settled
        .filter((r) => r.status === 'rejected')
        .map((r) => r.reason);
      if (errors.length) {
        this.logger.error(
          `Failed to get ${errors.length} live streams from Rumble ${errors.join(', ')}`,
        );
      }

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
        `Failed to get live streams from Rumble ${error.message}`,
      );
    }

    return [];
  }
}
