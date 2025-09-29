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

  // async getLiveStreams(identifier?: string) {
  //   let channelId: string;

  //   if (identifier?.startsWith('@')) {
  //     channelId = await this.getChannelIdByUsername(identifier);
  //   } else {
  //     channelId = identifier;
  //   }
  //   if (!channelId) {
  //     throw new NotFoundException(`Channel id not found for ${identifier}.`);
  //   }

  //   this.logger.log(`Getting live streams for channel ${channelId}`);

  //   const uploads = await this.getUploadActivities(channelId);

  //   if (!uploads?.length) {
  //     return [];
  //   }

  //   const videoIds = uploads.map(
  //     (upload) => upload.contentDetails?.upload?.videoId,
  //   );
  //   const streams = await this.getLiveVideosDetails(videoIds);

  //   return streams || [];
  // }

  async getUploadActivities(channelId: string) {
    const youtube = this.getYoutube();

    try {
      this.logger.log(`activities - ${channelId}`);
      const { data } = await youtube.activities.list({
        channelId,
        part: ['snippet', 'contentDetails'],
        maxResults: 5,
        // channelId,
        // eventType: 'live',
        // type: ['video'],
        // part: ['snippet'],
        // maxResults: 1,
      });

      const uploadsOnly = data.items.filter(
        (item) => item.snippet.type === 'upload',
      );
      return uploadsOnly;
    } catch (error) {
      console.log(error.response.data.error);
      throw new BadRequestException('Error searching live streams.');
    }
  }

  async getLiveVideosDetails(videoIds: string[]) {
    const videos = await this.getVideosDetails(videoIds);
    return videos.filter(
      (video) => video.snippet.liveBroadcastContent === 'live',
    );
  }

  async getVideosDetails(videoIds: string[]) {
    const youtube = this.getYoutube();

    try {
      this.logger.log(`videos details - ${videoIds.length} ids.`);
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
      this.logger.log(`channel id - ${username}`);
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
