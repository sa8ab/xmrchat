import { Injectable, Logger } from '@nestjs/common';
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
import { youtube_v3 } from 'googleapis';

@Injectable()
export class YoutubeProvider implements LiveStreamProvider {
  private logger = new Logger(YoutubeProvider.name);

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

        allVideoIds.push(
          ...videoIds.map((videoId) => ({ pageId: param.pageId, videoId })),
        );
      } catch (error) {
        this.logger.error(
          `Error getting upload activities for username ${param.username}: ${error.message}`,
        );
      }
    });

    await Promise.all(getIdsList);

    let videos: youtube_v3.Schema$Video[] = [];
    try {
      videos = await this.youtubeService.getLiveVideosDetails(
        allVideoIds.map((videoId) => videoId.videoId),
      );
    } catch (error) {
      this.logger.error(`Error getting live videos details: ${error.message}`);
    }

    const liveStreams: CreateLiveStreamDto[] = allVideoIds
      .map(({ pageId, videoId }) => {
        const video = videos.find((video) => video.id === videoId);
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

    // Filter to ensure only one video per page
    const pageVideoMap = new Map<number, CreateLiveStreamDto>();
    liveStreams.forEach((stream) => {
      if (!pageVideoMap.has(stream.pageId)) {
        pageVideoMap.set(stream.pageId, stream);
      }
    });

    return Array.from(pageVideoMap.values());
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
    if (link?.data?.skip || !param.username) return undefined;

    const channelId = await this.youtubeService.getChannelIdByUsername(
      param.username,
    );
    if (!channelId) {
      // save a item on data not to retry this again
      await this.saveDataOnLink({ skip: true }, param.pageId);
      return undefined;
    }

    await this.saveDataOnLink({ youtubeChannelId: channelId }, param.pageId);
    return channelId;
  }

  async saveDataOnLink(data: any, pageId: number) {
    const link = await this.linkRepo.findOne({
      where: { page: { id: pageId }, platform: LiveStreamPlatformEnum.YOUTUBE },
    });

    if (!link) return;

    await this.linkRepo.update(link.id, {
      data,
    });
  }
}
