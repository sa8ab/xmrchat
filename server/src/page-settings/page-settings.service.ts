import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageSetting } from './page-setting.entity';
import { Repository } from 'typeorm';
import { PagesService } from '../pages/pages.service';
import { PageSettingCategory, PageSettingKey } from 'src/shared/constants/enum';
import { UpdatePageSettingBaseDto } from './dto/update-page-setting.dto';
import {
  getPageSettingCategory,
  getPageSettingType,
} from 'src/shared/utils/settings';

@Injectable()
export class PageSettingsService {
  constructor(
    @InjectRepository(PageSetting) private repo: Repository<PageSetting>,
    private pagesService: PagesService,
  ) {}

  async getByPageId(pageId: number, category?: PageSettingCategory) {
    if (!pageId) return null;

    return this.repo.findBy({
      page: { id: pageId },
      category,
    });
  }

  async getByPageSlug(slug: string, category?: PageSettingCategory) {
    if (!slug) return null;
    const page = await this.pagesService.findByPath(slug);
    return this.repo.findBy({
      page: { id: page.id },
      category,
    });
  }

  async upsert(pageId: number, settings: UpdatePageSettingBaseDto[]) {
    const fullSettings = settings.map((setting) => {
      return {
        key: setting.key,
        value: setting.value,
        category: getPageSettingCategory(setting.key),
        type: getPageSettingType(setting.key),
        page: { id: pageId },
      };
    });

    // upsert settings
    await this.repo.upsert(fullSettings, ['key', 'page.id']);

    return 'Settings updated.';
  }

  async getSettingValue<T = string>(slug: string, key: PageSettingKey) {
    const page = await this.pagesService.findByPath(slug);
    const setting = await this.repo.findOne({
      where: { page: { id: page.id }, key },
    });

    return setting?.value as T;
  }
}
