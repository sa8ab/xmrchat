import { Injectable } from '@nestjs/common';
import {
  ILinkVerificationHandler,
  ILinkVerificationHandlerData,
  ILinkVerificationHandlerResponse,
} from './handler.interface';
import { ConfigService } from '@nestjs/config';
import { Page } from 'src/pages/page.entity';
import { HttpService } from '@nestjs/axios';

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
    const { data: tweetData } = await this.httpService.axiosRef.get(
      `https://publish.twitter.com/oembed?url=${tweetUrl}&hide_thread=true&hide_media=true`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
          Referer: 'https://reddit.com',
        },
      },
    );

    const name = tweetData.author_name;
    const userUrl = tweetData.author_url as string;
    const html = tweetData.html;

    // Validate that link.value matches the username from author_url
    const linkValue = data.link.value.toLowerCase();
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
      const { request } = await this.httpService.axiosRef.get(tCoUrl, {
        validateStatus: () => true,
      });

      resolvedUrl = request?.res?.responseUrl;
    } catch (error) {
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
    // const clientUrl = this.configService.get('CLIENT_BASE_URL');
    const clientUrl = 'https://xmrchat.com';
    return `${clientUrl}/${page.path}`;
  }
}
