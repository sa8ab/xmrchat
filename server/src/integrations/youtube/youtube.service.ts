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
import { getErrorMessage } from 'src/shared/utils/errors';

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
      const { data } = await youtube.activities.list({
        channelId,
        part: ['snippet', 'contentDetails'],
        maxResults: 3,
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
      throw new BadRequestException('Error searching upload activities.');
    }
  }

  async getLiveVideosDetails(videoIds: string[]) {
    const videos = await this.getVideosDetails(videoIds);
    return videos.filter(
      (video) => video.snippet.liveBroadcastContent === 'live',
    );
  }

  async getVideosDetails(videoIds: string[]) {
    if (!videoIds.length) return [];

    const youtube = this.getYoutube();
    const allVideos: youtube_v3.Schema$Video[] = [];
    const batchSize = 50;

    // Process video IDs in batches of 50
    for (let i = 0; i < videoIds.length; i += batchSize) {
      const batch = videoIds.slice(i, i + batchSize);
      try {
        const { data } = await youtube.videos.list({
          id: batch,
          part: ['snippet', 'liveStreamingDetails', 'statistics'],
        });

        if (data.items) {
          allVideos.push(...data.items);
        }
      } catch (error) {
        this.logger.error(
          `Error getting video details for batch ${Math.floor(i / batchSize) + 1}: ${error.response?.data?.error || error.message}`,
        );
      }
    }

    return allVideos;
  }

  async getChannelIdByUsername(username: string) {
    const youtube = this.getYoutube();
    this.logger.log(`Getting channel id by username ${username}`);

    try {
      const { data } = await youtube.channels.list({
        forHandle: username,
        part: ['id'],
      });

      const id = data.items?.[0]?.id;
      return id;
    } catch (error) {
      throw new BadRequestException(
        'Error getting channel id by username.',
        getErrorMessage(error),
      );
    }
  }

  getYoutube() {
    if (this.youtube) return this.youtube;
    throw new InternalServerErrorException('YOUTUBE_API_KEY is not set.');
  }
}
