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

        const firstVideoId = videoIds[0];
        if (!firstVideoId) return;

        allVideoIds.push({ pageId: param.pageId, videoId: firstVideoId });
      } catch (error) {}
    });

    await Promise.all(getIdsList);

    const videos = await this.youtubeService.getLiveVideosDetails(
      allVideoIds.map((videoId) => videoId.videoId),
    );
    const flatVideos = videos.flatMap((item) => item);

    const liveStreams: CreateLiveStreamDto[] = allVideoIds
      .map(({ pageId, videoId }) => {
        const video = flatVideos.find((video) => video.id === videoId);

        if (!video) return;

        return {
          pageId,
          title: video.snippet.title,
          description: video.snippet.description,
          channelId: video.snippet.channelId,
          channelName: video.snippet.channelTitle,
          videoId: video.id,
          imageUrl: video.snippet.thumbnails.standard.url,
          platform: LiveStreamPlatformEnum.YOUTUBE,
          startedAt: video.liveStreamingDetails?.actualStartTime,
          viewerCount: Number(video.statistics.viewCount),
        };
      })
      .filter((stream) => Boolean(stream));

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

    if (!param.username) return undefined;

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
