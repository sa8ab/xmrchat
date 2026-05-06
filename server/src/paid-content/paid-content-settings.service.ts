import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { PagesService } from 'src/pages/pages.service';
import { PageSettingCategory, PageSettingKey } from 'src/shared/constants';
import { User } from 'src/users/user.entity';

@Injectable()
export class PaidContentSettingsService {
  constructor(
    private pagesService: PagesService,
    private pageSettingsService: PageSettingsService,
  ) {}

  async getSettings(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    return this.pageSettingsService.getByPageId(
      page.id,
      PageSettingCategory.PAID_CONTENT,
    );
  }

  async updateSettings(_dto: unknown, _user: User) {
    return {};
  }
}
