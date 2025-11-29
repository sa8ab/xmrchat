import { Injectable, NotFoundException } from '@nestjs/common';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { PagesService } from 'src/pages/pages.service';
import { UpdateSuperDmSettingDto } from './dto/update-super-dm-setting.dto';
import { User } from 'src/users/user.entity';
import { PageSettingCategory, PageSettingKey } from 'src/shared/constants';

@Injectable()
export class SuperDmService {
  constructor(
    private pageSettingsService: PageSettingsService,
    private pagesService: PagesService,
  ) {}

  // verify signature

  // reset public key

  // get list of super dms for page - needs signature
  // get a super dm by id
  // end super dm
}
