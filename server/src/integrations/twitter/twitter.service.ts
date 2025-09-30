import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';

// This service is not used, the twitter api free version
// does not provide enough data to be using for live streams.

@Injectable()
export class TwitterService implements OnModuleInit {
  private logger = new Logger(TwitterService.name);
  private client: TwitterApi;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // const token = this.configService.get('TWITTER_BEARER_TOKEN');
    // if (!token) {
    //   this.logger.warn(
    //     'TWITTER_BEARER_TOKEN is not set. Twitter integrations will not work.',
    //   );
    //   return;
    // }
    // this.client = new TwitterApi(token);
  }

  getClient() {
    throw new ServiceUnavailableException('Twitter service is not available.');
    const token = this.configService.get('TWITTER_BEARER_TOKEN');
    if (!token || !this.client)
      throw new InternalServerErrorException(
        'Twitter client is not initialized',
      );

    return this.client;
  }

  async getLiveStreams(usernames: string[]) {
    if (!usernames.length) return [];
    const client = this.getClient();

    try {
      // Build query for live videos from specified usernames
      const fromQueries = usernames
        .map((username) => `from:${username}`)
        .join(' OR ');
      const query = `(${fromQueries}) (has:videos OR has:media) (live OR livestream OR streaming) -is:retweet -is:reply`;

      const response = await client.v2.search({
        max_results: 100,
        query,
        expansions: ['attachments.media_keys', 'author_id'],
        'tweet.fields': [
          'id',
          'text',
          'created_at',
          'author_id',
          'attachments',
          'public_metrics',
        ],
        'media.fields': [
          'media_key',
          'type',
          'duration_ms',
          'variants',
          'preview_image_url',
          'url',
        ],
        'user.fields': ['username', 'name', 'public_metrics'],
      });

      this.logger.log(
        `Found ${response.data?.data?.length || 0} tweets with media from ${usernames.length} users`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get live streams from Twitter: ${error.message}`,
      );
      throw new ServiceUnavailableException(
        `Failed to get live streams from Twitter: ${error.message}`,
      );
    }
  }

  async getUserIdsFromUsernames(usernames: string[]) {
    const client = this.getClient();

    try {
      const response = await client.v2.usersByUsernames(usernames.join(','));

      return response.data.map((user) => ({
        id: user.id,
        username: user.username,
      }));
    } catch (error) {
      throw new ServiceUnavailableException(
        `Failed to get user ids from usernames: ${error.message}`,
      );
    }
  }
}
