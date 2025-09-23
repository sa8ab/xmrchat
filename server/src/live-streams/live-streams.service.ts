import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from 'src/links/link.entity';
import { LinkPlatformEnum, LiveStreamPlatformEnum } from 'src/shared/constants';
import { IsNull, Not, Repository } from 'typeorm';
import { YoutubeProvider } from './providers/youtube.provider';
import { CreateLiveStreamDto } from './dtos/create-live-stream.dto';
import { LiveStream } from './live-stream.entity';

@Injectable()
export class LiveStreamsService {
  constructor(
    @InjectRepository(Link) private linksRepo: Repository<Link>,
    @InjectRepository(LiveStream) private repo: Repository<LiveStream>,
    private youtubeProvider: YoutubeProvider,
  ) {}

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

    await this.updateLiveStreams(youtube);
    const result = await this.findAll();
    return result;
  }

  async getYoutubeLiveStreams() {
    const links = await this.getLinksByPlatform(LiveStreamPlatformEnum.YOUTUBE);

    return this.youtubeProvider.getLiveStreams(
      links.map((link) => ({ username: link.value, pageId: link.page.id })),
    );
  }

  async getLinksByPlatform(platform: LiveStreamPlatformEnum) {
    const links = await this.linksRepo.find({
      where: { platform, value: Not(IsNull()) },
      relations: { page: true },
    });

    return links;
  }
}
