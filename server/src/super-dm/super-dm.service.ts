import { Injectable, NotFoundException } from '@nestjs/common';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { PagesService } from 'src/pages/pages.service';

@Injectable()
export class SuperDmService {
  constructor(
    private pageSettingsService: PageSettingsService,
    private pagesService: PagesService,
  ) {}

  // get list of super dms for page - needs signature
  // get a super dm by id
  // end super dm
}
