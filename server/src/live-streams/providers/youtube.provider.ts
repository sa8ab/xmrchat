import { Injectable } from '@nestjs/common';
import { YoutubeService } from 'src/integrations/youtube/youtube.service';
import {
  LiveStreamProvider,
  LiveStreamProviderParams,
} from './live-stream-provider.interface';
import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';
import { LiveStreamPlatformEnum } from 'src/shared/constants';

@Injectable()
export class YoutubeProvider implements LiveStreamProvider {
  constructor(private readonly youtubeService: YoutubeService) {}

  async getLiveStreams(
    params: LiveStreamProviderParams[],
  ): Promise<CreateLiveStreamDto[]> {
    if (!params.length) return [];

    const items = params.map((param) =>
      this.youtubeService.getLiveStreams(param.username),
    );

    const result = await Promise.all(items);

    const liveStreams: CreateLiveStreamDto[] = result
      .flatMap((item) => item)
      .map((item) => {
        return {
          title: item.snippet.title,
          description: item.snippet.description,
          channelId: item.snippet.channelId,
          channelName: item.snippet.channelTitle,
          imageUrl: item.snippet.thumbnails.default.url,
          platform: LiveStreamPlatformEnum.YOUTUBE,
          startedAt: item.liveStreamingDetails.actualStartTime,
          viewerCount: Number(item.statistics.viewCount),
          // pageId: params.find(
          //   (param) => param.username === item.snippet.,
          // ).pageId,
        };
      });

    return liveStreams;
  }
}
