import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkPlatformEnum, PageStatusEnum } from 'src/shared/constants';
import { And, IsNull, Not, Repository } from 'typeorm';
import { YoutubeProvider } from './providers/youtube.provider';
import { CreateLiveStreamDto } from './dtos/create-live-stream.dto';
import { LiveStream } from './live-stream.entity';
import { LinksService } from 'src/links/links.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { TwitchProvider } from './providers/twitch.provider';
import { Page } from 'src/pages/page.entity';
import { RumbleProvider } from './providers/rumble.provider';

@Injectable()
export class LiveStreamsService implements OnModuleInit {
  constructor(
    private linksService: LinksService,
    private youtubeProvider: YoutubeProvider,
    private twitchProvider: TwitchProvider,
    private rumbleProvider: RumbleProvider,
    private config: ConfigService,
    @InjectRepository(LiveStream) private repo: Repository<LiveStream>,
    @InjectRepository(Page) private pagesRepo: Repository<Page>,
    @InjectQueue('live-stream') private liveStreamQueue: Queue,
  ) {}

  onModuleInit() {
    const interval = this.config.get('LIVE_STREAM_INTERVAL') || 5;
    this.liveStreamQueue.upsertJobScheduler('streams', {
      // every 5 minutes
      pattern: `*/${interval} * * * *`,
    });
  }

  async findAll() {
    return this.repo.find({
      relations: { page: true },
    });
  }

  async updateLiveStreams(dto: CreateLiveStreamDto[]) {
    await this.repo.manager.transaction(async (manager) => {
      // Delete all existing streams
      await manager.delete(LiveStream, {});

      if (!dto.length) return;
      const created = dto.map((stream) => {
        return this.repo.create({
          platform: stream.platform,
          title: stream.title,
          description: stream.description,
          imageUrl: stream.imageUrl,
          channelId: stream.channelId,
          channelName: stream.channelName,
          videoId: stream.videoId,
          viewerCount: stream.viewerCount,
          startedAt: stream.startedAt ? new Date(stream.startedAt) : null,
          data: stream.data,
          page: { id: stream.pageId },
        });
      });

      await manager.save(LiveStream, created);
    });
  }

  async getAndUpdateLiveStreams() {
    const youtube = await this.getYoutubeLiveStreams();
    const twitch = await this.getTwitchLiveStreams();
    const rumble = await this.getRumbleLiveStreams();

    await this.updateLiveStreams([...youtube, ...twitch, ...rumble]);
    const result = await this.findAll();
    return result;
  }

  async getTwitchLiveStreams() {
    const links = await this.linksService.findByPlatform(
      LinkPlatformEnum.TWITCH,
    );

    const linkParams = links.map((link) => ({
      username: link.value,
      pageId: link.page.id,
    }));

    const pages = await this.pagesRepo.find({
      where: {
        twitchChannel: And(Not(IsNull()), Not('')),
        isPublic: true,
        status: Not(PageStatusEnum.DEACTIVE),
      },
    });

    const pageParams = pages.map((page) => ({
      username: page.twitchChannel,
      pageId: page.id,
    }));

    const linkPageIds = new Set(linkParams.map((param) => param.pageId));
    const uniquePageParams = pageParams.filter(
      (param) => !linkPageIds.has(param.pageId),
    );

    const params = [...linkParams, ...uniquePageParams];
    console.log(`getting params for twitch`, params);

    return this.twitchProvider.getLiveStreams(params);
  }

  async getYoutubeLiveStreams() {
    const links = await this.linksService.findByPlatform(
      LinkPlatformEnum.YOUTUBE,
    );

    const params = links.map((link) => ({
      username: link.value,
      pageId: link.page.id,
    }));

    return this.youtubeProvider.getLiveStreams(params);
  }

  async getRumbleLiveStreams() {
    const links = await this.linksService.findByPlatform(
      LinkPlatformEnum.RUMBLE,
    );
    const linksWithData = links.filter((link) =>
      Boolean(link.data?.rumbleLiveStreamUrl),
    );

    const params = linksWithData.map((link) => ({
      url: link.data?.rumbleLiveStreamUrl,
      pageId: link.page.id,
    }));

    return this.rumbleProvider.getLiveStreams(params);
  }
}
