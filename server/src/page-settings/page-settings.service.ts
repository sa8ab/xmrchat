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
import { File } from 'src/files/file.entity';
import { serializer } from 'src/shared/interceptors/serialize.interceptor';
import { FileDto } from 'src/files/dtos/file.dto';

@Injectable()
export class PageSettingsService {
  constructor(
    @InjectRepository(PageSetting) private repo: Repository<PageSetting>,
    @InjectRepository(File) private filesRepo: Repository<File>,
    private pagesService: PagesService,
  ) {}

  async getByPageId(pageId: number, category?: PageSettingCategory) {
    if (!pageId) return null;

    const result = await this.repo.findBy({
      page: { id: pageId },
      category,
    });

    const resultWithData = result.map(async (setting) => {
      const data = await this.getSettingData(setting.key, setting.value);
      return {
        ...setting,
        data,
      };
    });

    return await Promise.all(resultWithData);
  }

  async getByPageSlug(slug: string, category?: PageSettingCategory) {
    if (!slug) return null;
    const page = await this.pagesService.findByPath(slug);
    const result = await this.repo.findBy({
      page: { id: page.id },
      category,
    });

    const resultWithData = result.map(async (setting) => {
      const data = await this.getSettingData(setting.key, setting.value);
      return {
        ...setting,
        data,
      };
    });

    return await Promise.all(resultWithData);
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

  async getSettingData(key: PageSettingKey, value: string) {
    if (!key || !value) return null;

    if (key === PageSettingKey.OBS_SOUND) {
      const file = await this.filesRepo.findOne({
        where: { id: Number(value) },
      });
      return file;
    }

    return null;
  }

  async getSettingValue<T = string>(slug: string, key: PageSettingKey) {
    const page = await this.pagesService.findByPath(slug);
    const setting = await this.repo.findOne({
      where: { page: { id: page.id }, key },
    });

    return setting?.value as T;
  }
}
