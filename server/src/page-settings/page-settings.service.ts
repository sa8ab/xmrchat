import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageSetting } from './page-setting.entity';
import { Repository } from 'typeorm';
import { PagesService } from '../pages/pages.service';
import { PageSettingCategory, PageSettingKey } from 'src/shared/constants/enum';

@Injectable()
export class PageSettingsService {
  constructor(
    @InjectRepository(PageSetting) private repo: Repository<PageSetting>,
    private pagesService: PagesService,
  ) {}

  async upsert(pageId: number) {
    // get current list of current settings
    const settings = await this.repo.findBy({ page: { id: pageId } });

    const data = [
      {
        key: PageSettingKey.OBS_PLAY_SOUND,
        type: 'boolean',
        category: PageSettingCategory.OBS,
        page: { id: pageId },
      },
      {
        key: PageSettingKey.OBS_KEEP_MESSAGES,
        value: 'false',
        page: { id: pageId },
        type: 'boolean',
        category: PageSettingCategory.OBS,
      },
    ];

    // console.log(settings);

    // upsert settings
    await this.repo.upsert(data, ['key', 'page.id']);

    return 'Settings updated.';
  }
}
