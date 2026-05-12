import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Cache } from 'cache-manager';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { Page } from 'src/pages/page.entity';
import { PagesService } from 'src/pages/pages.service';
import { PageSettingCategory, PageSettingKey } from 'src/shared/constants';
import { User } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaidContentSettingsService {
  constructor(
    private pagesService: PagesService,
    private pageSettingsService: PageSettingsService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getSettings(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    return this.pageSettingsService.getByPageId(
      page.id,
      PageSettingCategory.PAID_CONTENT,
    );
  }

  async settingsConfigured(page: Page) {
    const telegramUserId = await this.pageSettingsService.getSettingValue(
      page.path,
      PageSettingKey.TELEGRAM_USER_ID,
    );
    const telegramPaidContentId =
      await this.pageSettingsService.getSettingValue(
        page.path,
        PageSettingKey.TELEGRAM_PAID_CONTENT_ID,
      );
    return Boolean(telegramUserId && telegramPaidContentId);
  }

  async createTelegramUrl(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    const cachedId = await this.cacheManager.get(
      `telegram-start-id:${page.path}`,
    );
    if (cachedId) {
      return this.generateTelegramStartUrl(cachedId as string);
    }

    const uuid = uuidv4();

    await this.cacheManager.set(`telegram-start-id:${page.path}`, uuid, {
      ttl: 60 * 60 * 24,
    } as any);

    return this.generateTelegramStartUrl(uuid);
  }

  generateTelegramStartUrl(id: string) {
    const username = this.configService.get('TELEGRAM_PAID_CONTENT_USERNAME');
    return `https://t.me/${username}?start=${id}`;
  }

  async updateSettings(_dto: unknown, _user: User) {
    return {};
  }
}
