import { Injectable } from '@nestjs/common';
import {
  ILinkVerificationHandler,
  ILinkVerificationHandlerData,
  ILinkVerificationHandlerResponse,
} from './handler.interface';
import { ConfigService } from '@nestjs/config';
import { Page } from 'src/pages/page.entity';
import { HttpService } from '@nestjs/axios';
import { getErrorMessage } from 'src/shared/utils/errors';

@Injectable()
export class TwitterVerificationHandler implements ILinkVerificationHandler {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}
  async verify(
    data: ILinkVerificationHandlerData,
  ): Promise<ILinkVerificationHandlerResponse> {
    const page = data.page;

    // load tweet
    const tweetUrl = data.data.tweetUrl;
    let tweetData: any;
    try {
      const { data } = await this.httpService.axiosRef.get(
        `https://publish.twitter.com/oembed?url=${tweetUrl}&hide_thread=true&hide_media=true`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
            Referer: 'https://reddit.com',
          },
        },
      );
      tweetData = data;
    } catch (error) {
      console.log('Failed to load tweet data.', error.message);
      return { valid: false, message: 'Failed to load tweet data.' };
    }

    const name = tweetData.author_name;
    const userUrl = tweetData.author_url as string;
    const html = tweetData.html;

    // Validate that link.value matches the username from author_url
    let linkValue = data.link.value.toLowerCase();
    if (linkValue.startsWith('@')) linkValue = linkValue.slice(1);
    
    // Extract username from author_url by taking last segment after "/"
    const authorUsername = userUrl.split('/').pop()?.toLowerCase();
    if (!authorUsername) {
      return {
        valid: false,
        message: 'Invalid tweet URL.',
      };
    }

    if (authorUsername !== linkValue) {
      return {
        valid: false,
        message: 'Tweet should be from the same user on the link.',
      };
    }

    // Extract first t.co link from tweet HTML
    const tCoLinkMatch = html.match(
      /<a[^>]+href=["'](https?:\/\/t\.co\/[^"']+)["']/i,
    );
    if (!tCoLinkMatch || !tCoLinkMatch[1]) {
      return { valid: false };
    }

    const tCoUrl = tCoLinkMatch[1];

    // Resolve t.co redirect to get final URL
    let resolvedUrl: string;
    try {
      const response = await this.httpService.axiosRef.get(tCoUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
          Referer: 'https://reddit.com',
        },
        maxRedirects: 0,
        validateStatus: () => true,
        responseType: 'text',
        timeout: 10000,
      });

      const htmlText = response.data as string;

      const metaRefreshMatch = htmlText.match(
        /<META\s+http-equiv=["']refresh["']\s+content=["']\d+;URL=([^"']+)["']/i,
      );
      if (metaRefreshMatch && metaRefreshMatch[1]) {
        resolvedUrl = metaRefreshMatch[1];
      } else {
        const locationReplaceMatch = htmlText.match(
          /location\.replace\(["']([^"']+)["']\)/i,
        );
        if (locationReplaceMatch && locationReplaceMatch[1]) {
          resolvedUrl = locationReplaceMatch[1];
        } else {
          console.log('Failed to extract redirect URL from HTML');
          return { valid: false };
        }
      }
    } catch (error) {
      console.log(
        'Failed to resolve t.co redirect to get final URL',
        error.message,
      );
      return { valid: false };
    }

    // Get expected URL from getTweetUrl
    const expectedUrl = await this.getTweetUrl(page);

    const resolved = resolvedUrl.endsWith('/')
      ? resolvedUrl.slice(0, -1)
      : resolvedUrl;
    const expected = expectedUrl.endsWith('/')
      ? expectedUrl.slice(0, -1)
      : expectedUrl;

    const isValid = resolved === expected;

    return { valid: isValid };
  }

  async getTweetUrl(page: Page) {
    const clientUrl = this.configService.get('CLIENT_BASE_URL');
    return `${clientUrl}/${page.path}`;
  }
}
