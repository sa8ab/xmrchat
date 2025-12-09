import {
  Body,
  Controller,
  Get,
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

@Controller('super-dms')
export class SuperDmsController {
  constructor(
    private SuperDmsService: SuperDmsService,
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
  @IsPublic()
  @Serialize(SuperDmCreateRO)
  async create(@Body() dto: CreateSuperDmDto) {
    return await this.SuperDmsService.createSuperDm(dto);
  }

  @Get('/:id')
  @Serialize(SuperDmRO)
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const superDm = await this.SuperDmsService.findById(id);
    return { superDm };
  }

  @Get('/')
  @Serialize(SuperDmsRO)
  async findAll(@CurrentUser() user: User) {
    const superDms = await this.SuperDmsService.findAll(user);
    return { superDms };
  }
}
