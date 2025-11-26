import { Injectable, NotFoundException } from '@nestjs/common';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { PagesService } from 'src/pages/pages.service';
import { UpdateSuperDmSettingDto } from './dto/update-super-dm-setting.dto';
import { User } from 'src/users/user.entity';
import { PageSettingKey } from 'src/shared/constants';

@Injectable()
export class SuperDmService {
  constructor(
    private pageSettingsService: PageSettingsService,
    private pagesService: PagesService,
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
          key: PageSettingKey.SUPERDM_ACTIVE,
          value: dto.superDmActive,
        },
      ],
      user,
    );
  }

  // verify signature

  // reset public key

  // get list of super dms for page - needs signature
  // get a super dm by id
  // end super dm
}
