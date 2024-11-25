import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { PageSettingsService } from './page-settings.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { UpdatePageSettingDto } from './dto/update-page-setting.dto';
import { PagesService } from 'src/pages/pages.service';

@Controller('page-settings')
export class PageSettingsController {
  constructor(
    private pageSettings: PageSettingsService,
    private pagesService: PagesService,
  ) {}

  @Put('/:pageId')
  async upsert(
    @Param('pageId') pageId: number,
    @CurrentUser() user: User,
    @Body() body: UpdatePageSettingDto,
  ) {
    if (!pageId) throw new BadRequestException('Page id is required');

    const page = await this.pagesService.findById(pageId);

    if (!page) throw new NotFoundException('Page not found.');

    if (page.userId != user.id)
      throw new UnauthorizedException('Unauthorized.');

    console.log(body);

    return this.pageSettings.upsert(pageId, body.settings);
  }
}
