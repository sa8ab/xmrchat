import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, youtube_v3 } from 'googleapis';

@Injectable()
export class YoutubeService implements OnModuleInit {
  private logger = new Logger(YoutubeService.name);
  private youtube: youtube_v3.Youtube;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get('YOUTUBE_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'YOUTUBE_API_KEY is not set. Youtube integrations will not work.',
      );
      return;
    }
    this.youtube = google.youtube({ version: 'v3', auth: apiKey });
  }

  async getLiveStreams(username: string = 'DeepUniverseRadio') {
    const channelId = await this.getChannelIdByUsername(username);

    if (!channelId) {
      throw new NotFoundException(`Channel id not found for ${username}.`);
    }

    this.logger.log(`Getting live stream for channel ${channelId}`);

    const streams = await this.searchLiveStreams(channelId);

    if (!streams?.length) {
      return [];
    }

    const videoIds = streams.map((stream) => stream.id.videoId);
    const result = await this.getVideoDetails(videoIds);

    return result || [];
  }

  async searchLiveStreams(channelId: string) {
    const youtube = this.getYoutube();

    try {
      const { data } = await youtube.search.list({
        channelId,
        eventType: 'live',
        type: ['video'],
        part: ['snippet'],
      });

      return data.items;
    } catch (error) {
      console.log(error.response.data.error);
      throw new BadRequestException('Error searching live streams.');
    }
  }

  async getVideoDetails(videoIds: string[]) {
    const youtube = this.getYoutube();

    try {
      const { data } = await youtube.videos.list({
        id: videoIds,
        part: ['snippet', 'liveStreamingDetails', 'statistics'],
      });

      return data.items;
    } catch (error) {
      console.log(error.response.data.error);
      throw new BadRequestException('Error getting video details.');
    }
  }

  async getChannelIdByUsername(username: string) {
    const youtube = this.getYoutube();
    try {
      const { data } = await youtube.channels.list({
        forHandle: username,
        part: ['id'],
      });

      const id = data.items?.[0]?.id;
      return id;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error getting channel id by username.');
    }
  }

  getYoutube() {
    if (this.youtube) return this.youtube;
    throw new InternalServerErrorException('YOUTUBE_API_KEY is not set.');
  }
}
