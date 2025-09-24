import { Injectable } from '@nestjs/common';
import { YoutubeService } from 'src/integrations/youtube/youtube.service';
import {
  LiveStreamProvider,
  LiveStreamProviderParams,
} from './live-stream-provider.interface';
import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';
import { LiveStreamPlatformEnum } from 'src/shared/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from 'src/links/link.entity';
import { Repository } from 'typeorm';

@Injectable()
export class YoutubeProvider implements LiveStreamProvider {
  constructor(
    @InjectRepository(Link) private linkRepo: Repository<Link>,
    private readonly youtubeService: YoutubeService,
  ) {}

  // TODO: send all video ids on one request
  async getLiveStreams(
    params: LiveStreamProviderParams[],
  ): Promise<CreateLiveStreamDto[]> {
    if (!params.length) return [];
    const allVideoIds: { pageId: number; videoId: string }[] = [];

    const getIdsList = params.map(async (param) => {
      try {
        const channelId = await this.getAndSaveChannelId(param);
        if (!channelId) return;

        const activities =
          await this.youtubeService.getUploadActivities(channelId);

        const videoIds = activities
          .map((upload) => upload.contentDetails?.upload?.videoId)
          .filter(Boolean);

        allVideoIds.push(
          ...videoIds.map((videoId) => ({ pageId: param.pageId, videoId })),
        );
      } catch (error) {}
    });

    await Promise.all(getIdsList);

    const videos = await this.youtubeService.getLiveVideosDetails(
      allVideoIds.map((videoId) => videoId.videoId),
    );

    const liveStreams: CreateLiveStreamDto[] = videos
      .flatMap((item) => item)
      .map((item) => {
        return {
          title: item.snippet.title,
          description: item.snippet.description,
          channelId: item.snippet.channelId,
          channelName: item.snippet.channelTitle,
          imageUrl: item.snippet.thumbnails.default.url,
          platform: LiveStreamPlatformEnum.YOUTUBE,
          startedAt: item.liveStreamingDetails?.actualStartTime,
          viewerCount: Number(item.statistics.viewCount),
          pageId: allVideoIds.find((videoId) => videoId.videoId === item.id)
            ?.pageId,
        };
      });

    return liveStreams;
  }

  async getAndSaveChannelId(
    param: LiveStreamProviderParams,
  ): Promise<string | undefined> {
    const link = await this.linkRepo.findOne({
      where: {
        page: { id: param.pageId },
        platform: LiveStreamPlatformEnum.YOUTUBE,
      },
    });

    if (link?.data?.youtubeChannelId) return link.data.youtubeChannelId;

    const channelId = await this.youtubeService.getChannelIdByUsername(
      param.username,
    );
    if (!channelId) return undefined;

    await this.saveChannelIdOnLink(channelId, param.pageId);
    return channelId;
  }

  async saveChannelIdOnLink(channelId: string, pageId: number) {
    const link = await this.linkRepo.findOne({
      where: { page: { id: pageId }, platform: LiveStreamPlatformEnum.YOUTUBE },
    });

    if (!link) return;

    await this.linkRepo.update(link.id, {
      data: { youtubeChannelId: channelId } as any,
    });
  }
}
