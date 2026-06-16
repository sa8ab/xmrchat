import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PaidContentService } from './paid-content.service';
import { PaidContentRO } from './dtos/paid-content.dto';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { CreatePaidContentDto } from './dtos/create-paid-content.dto';
import { UpdatePaidContentDto } from './dtos/update-paid-content.dto';
import { PaidContentSettingsService } from './paid-content-settings.service';
import { PageSettingRO } from 'src/page-settings/dto/page-setting.dto';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { PagesService } from 'src/pages/pages.service';

@Controller('paid-content')
export class PaidContentController {
  constructor(
    private paidContentService: PaidContentService,
    private paidContentSettingsService: PaidContentSettingsService,
    private pagesService: PagesService,
  ) {}

  @Get('/')
  @Serialize(PaidContentRO)
  async findAll(@CurrentUser() user: User) {
    const result = await this.paidContentService.findAll(user);

    return { paidContent: result };
  }

  @Get('/settings')
  @Serialize(PageSettingRO)
  async getSettings(@CurrentUser() user: User) {
    const settings = await this.paidContentSettingsService.getSettings(user);
    return { settings };
  }

  @Post('/telegram-url')
  async createTelegramUrl(@CurrentUser() user: User) {
    const url = await this.paidContentSettingsService.createTelegramUrl(user);
    return { url };
  }

  @Get('/:pageSlug/settings/state')
  @IsPublic()
  async settingsState(@Param('pageSlug') pageSlug: string) {
    const page = await this.pagesService.findByPath(pageSlug);
    if (!page) throw new NotFoundException('Page not found');

    // const active = await this.paidContentSettingsService.isPaidContentActive(page);
    const settingsConfigured =
      await this.paidContentSettingsService.settingsConfigured(page);

    return { configured: settingsConfigured };
  }

  @Get('/:id')
  @Serialize(PaidContentRO)
  async findOne(@Param('id') id: number, @CurrentUser() user: User) {
    const result = await this.paidContentService.findOne(id, user);

    return { paidContent: result };
  }

  @Post('/')
  async create(@Body() dto: CreatePaidContentDto, @CurrentUser() user: User) {
    await this.paidContentService.create(dto, user);

    return { message: 'Paid content created.' };
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePaidContentDto,
    @CurrentUser() user: User,
  ) {
    await this.paidContentService.update(id, dto, user);

    return { message: 'Paid content updated.' };
  }

  @Delete('/:id')
  async delete(@Param('id') id: number, @CurrentUser() user: User) {
    await this.paidContentService.delete(id, user);

    return { message: 'Paid content deleted.' };
  }
}
