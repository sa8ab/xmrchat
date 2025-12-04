import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { SuperDmService } from './super-dm.service';
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

@Controller('super-dm')
export class SuperDmController {
  constructor(
    private superDmService: SuperDmService,
    private superDmSettingsService: SuperDmSettingsService,
  ) {}

  // update super dm settings
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

  @Put('/public-key')
  async updatePublicKey(
    @Body() dto: UpdatePublicKeyDto,
    @CurrentUser() user: User,
  ) {
    await this.superDmSettingsService.updatePublicKey(dto.publicKey, user);
    return { message: 'Public key updated' };
  }

  // create super dm
  @Post('/')
  async create(@Body() dto: CreateSuperDmDto) {
    return await this.superDmService.createSuperDm(dto);
  }
}
