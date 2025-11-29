import { Body, Controller, Get, Put } from '@nestjs/common';
import { SuperDmService } from './super-dm.service';
import { UpdatePageSettingDto } from 'src/page-settings/dto/update-page-setting.dto';
import { UpdateSuperDmSettingDto } from './dto/update-super-dm-setting.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { PageSettingRO } from 'src/page-settings/dto/page-setting.dto';

@Controller('super-dm')
export class SuperDmController {
  constructor(
    private superDmService: SuperDmService,
    private pageSettingsService: PageSettingsService,
  ) {}

  // update super dm settings
  @Put('/settings')
  async updateSettings(
    @Body() dto: UpdateSuperDmSettingDto,
    @CurrentUser() user: User,
  ) {
    await this.superDmService.updateSettings(dto, user);
    return { message: 'Super DM settings updated' };
  }

  @Get('/settings')
  @Serialize(PageSettingRO)
  async getSettings(@CurrentUser() user: User) {
    const settings = await this.superDmService.getSettings(user);
    return { settings };
  }
}
