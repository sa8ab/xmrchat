import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
} from '@nestjs/common';
import { PageSettingsService } from './page-settings.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { UpdatePageSettingDto } from './dto/update-page-setting.dto';

@Controller('page-settings')
export class PageSettingsController {
  constructor(private pageSettings: PageSettingsService) {}

  @Put('/:pageId')
  upsert(
    @Param('pageId') pageId: number,
    @CurrentUser() user: User,
    @Body() body: UpdatePageSettingDto,
  ) {
    if (!pageId) throw new BadRequestException('Page id is required');

    console.log(body);

    // find page, match with user id.

    return this.pageSettings.upsert(pageId);
  }
}
