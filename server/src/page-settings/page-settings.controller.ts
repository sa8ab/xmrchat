import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PageSettingsService } from './page-settings.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { UpdatePageSettingDto } from './dto/update-page-setting.dto';
import { PagesService } from 'src/pages/pages.service';
import { PageSettingCategory } from 'src/shared/constants';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { PageSettingDto, PageSettingRO } from './dto/page-setting.dto';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';

@Controller('page-settings')
export class PageSettingsController {
  constructor(
    private pageSettings: PageSettingsService,
    private pagesService: PagesService,
  ) {}

  // Get my page settings
  @Get('/me')
  @Serialize(PageSettingRO)
  async getMySettings(
    @CurrentUser() user: User,
    @Query('category') category?: PageSettingCategory,
  ) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) throw new NotFoundException('Page not found.');

    const settings = await this.pageSettings.getByPageId(page.id, category);

    return { settings };
  }

  // Gets obs settings for a page
  @Get('/:slug/obs')
  @Serialize(PageSettingRO)
  @IsPublic()
  async getPageSettingsBySlug(@Param('slug') slug: string) {
    const page = await this.pagesService.findByPath(slug);
    if (!page) throw new NotFoundException('Page not found.');

    const settings = await this.pageSettings.getByPageSlug(
      page.path,
      PageSettingCategory.OBS,
    );

    return { settings };
  }

  @Put('/:pageId')
  async upsert(
    @Param('pageId', ParseIntPipe) pageId: number,
    @CurrentUser() user: User,
    @Body() body: UpdatePageSettingDto,
  ) {
    const page = await this.pagesService.findById(pageId);

    if (!page) throw new NotFoundException('Page not found.');

    if (page.userId != user.id)
      throw new UnauthorizedException('Unauthorized.');

    return this.pageSettings.upsert(pageId, body.settings);
  }
}
