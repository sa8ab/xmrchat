import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from 'src/links/link.entity';
import {
  LinkPlatformEnum,
  LiveStreamPlatformEnum,
  PageStatusEnum,
} from 'src/shared/constants';
import { IsNull, Not, Repository } from 'typeorm';
import { YoutubeProvider } from './providers/youtube.provider';
import { CreateLiveStreamDto } from './dtos/create-live-stream.dto';
import { LiveStream } from './live-stream.entity';
import { LinksService } from 'src/links/links.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { TwitchProvider } from './providers/twitch.provider';
import { Page } from 'src/pages/page.entity';

@Injectable()
export class LiveStreamsService implements OnModuleInit {
  constructor(
    @InjectRepository(Link) private linksRepo: Repository<Link>,
    @InjectRepository(LiveStream) private repo: Repository<LiveStream>,
    @InjectRepository(Page) private pagesRepo: Repository<Page>,
    private linksService: LinksService,
    private youtubeProvider: YoutubeProvider,
    private twitchProvider: TwitchProvider,
    @InjectQueue('live-stream') private liveStreamQueue: Queue,
    private config: ConfigService,
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
          viewerCount: stream.viewerCount,
          startedAt: stream.startedAt ? new Date(stream.startedAt) : null,
          page: { id: stream.pageId },
        });
      });

      await manager.save(LiveStream, created);
    });
  }

  async getAndUpdateLiveStreams() {
    const youtube = await this.getYoutubeLiveStreams();
    const twitch = await this.getTwitchLiveStreams();

    await this.updateLiveStreams([...youtube, ...twitch]);
    const result = await this.findAll();
    return result;
  }

  async getTwitchLiveStreams() {
    const pages = await this.pagesRepo.find({
      where: {
        twitchChannel: Not(IsNull()),
        isPublic: true,
        status: Not(PageStatusEnum.DEACTIVE),
      },
    });

    const params = pages.map((page) => ({
      username: page.twitchChannel,
      pageId: page.id,
    }));
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
}
