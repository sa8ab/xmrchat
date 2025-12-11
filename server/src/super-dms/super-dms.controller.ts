import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SuperDmsService } from './super-dms.service';
import { UpdatePageSettingDto } from 'src/page-settings/dto/update-page-setting.dto';
import { UpdateSuperDmSettingDto } from './dto/update-super-dm-setting.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { PageSettingRO } from 'src/page-settings/dto/page-setting.dto';
import { UpdatePublicKeyDto } from './dto/update-public-key.dto';
import { SuperDmSettingsService } from './super-dm-settings.service';
import { CreateSuperDmDto } from './dto/create-super-dm.dto';
import { SuperDmCreateRO } from './dto/create-super-dm.dto';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { SuperDmRO, SuperDmsRO } from './dto/super-dm.dto';
import { EndSuperDmDto } from './dto/end-super-dm.dto';
import { PagesService } from 'src/pages/pages.service';

@Controller('super-dms')
export class SuperDmsController {
  constructor(
    private superDmsService: SuperDmsService,
    private superDmSettingsService: SuperDmSettingsService,
    private pagesService: PagesService,
  ) {}

  @Put('/settings')
  async updateSettings(
    @Body() dto: UpdateSuperDmSettingDto,
    @CurrentUser() user: User,
  ) {
    await this.superDmSettingsService.updateSettings(dto, user);
    return { message: 'Super DM settings updated' };
  }

  @Get('/settings')
  @Serialize(PageSettingRO)
  async getSettings(@CurrentUser() user: User) {
    const settings = await this.superDmSettingsService.getSettings(user);
    return { settings };
  }

  @Put('/settings/public-key')
  async updatePublicKey(
    @Body() dto: UpdatePublicKeyDto,
    @CurrentUser() user: User,
  ) {
    await this.superDmSettingsService.updatePublicKey(dto.publicKey, user);
    return { message: 'Public key updated' };
  }

  @Get('/settings/active')
  async settingsActive(@CurrentUser() user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    const active = await this.superDmSettingsService.isSuperDmActive(page);
    return { active };
  }

  @Get('/')
  @Serialize(SuperDmsRO)
  async findAll(@CurrentUser() user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    const superDms = await this.superDmsService.findAll(user);
    const settingsConfigured =
      await this.superDmSettingsService.settingsConfigured(page);

    return { superDms, settingsConfigured };
  }

  @Get('/:id')
  @IsPublic()
  @Serialize(SuperDmRO)
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const superDm = await this.superDmsService.findById(id);
    return { superDm };
  }

  @Post('/')
  @IsPublic()
  @Serialize(SuperDmCreateRO)
  async create(@Body() dto: CreateSuperDmDto) {
    return await this.superDmsService.createSuperDm(dto);
  }

  @Put('/:id/end')
  @IsPublic()
  async endSuperDm(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EndSuperDmDto,
    @CurrentUser() user: User,
  ) {
    await this.superDmsService.endSuperDm(id, dto);
    return { message: 'Super DM ended successfully' };
  }
}
