import { Injectable, NotFoundException } from '@nestjs/common';
import { PagesService } from 'src/pages/pages.service';
import { User } from 'src/users/user.entity';
import { UpdateSuperDmSettingDto } from './dto/update-super-dm-setting.dto';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { PageSettingCategory, PageSettingKey } from 'src/shared/constants';

@Injectable()
export class SuperDmSettingsService {
  constructor(
    private pagesService: PagesService,
    private pageSettingsService: PageSettingsService,
  ) {}
  // updateSuperDm - gets min amount in xmr units. Save in page entity or page setting entity.

  async updateSettings(dto: UpdateSuperDmSettingDto, user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    await this.pageSettingsService.upsert(
      page.id,
      [
        {
          key: PageSettingKey.SUPER_DM_MIN_AMOUNT,
          value: dto.minSuperDmAmount,
        },
        {
          key: PageSettingKey.SUPER_DM_ACTIVE,
          value: dto.superDmActive,
        },
      ],
      user,
    );
  }

  async updatePublicKey(publicKey: string, user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    await this.pageSettingsService.upsert(
      page.id,
      [{ key: PageSettingKey.SUPER_DM_PUBLIC_KEY, value: publicKey }],
      user,
    );
  }

  async getSettings(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    const settings = await this.pageSettingsService.getByPageId(
      page.id,
      PageSettingCategory.SUPER_DM,
    );
    return settings;
  }

  async settingsConfigured(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    const publicKey = await this.pageSettingsService.getSettingValue(
      page.path,
      PageSettingKey.SUPER_DM_PUBLIC_KEY,
    );
    return Boolean(publicKey);
  }

  async isSuperDmActive(user: User) {
    const settingsConfigured = await this.settingsConfigured(user);
    if (!settingsConfigured) return false;

    const page = await this.pagesService.findMyPage(user);
    const active = await this.pageSettingsService.getSettingValue(
      page.path,
      PageSettingKey.SUPER_DM_ACTIVE,
    );
    return active === 'true';
  }
}
