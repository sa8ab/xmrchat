import { Body, Controller, Put } from '@nestjs/common';
import { SuperDmService } from './super-dm.service';
import { UpdatePageSettingDto } from 'src/page-settings/dto/update-page-setting.dto';
import { UpdateSuperDmSettingDto } from './dto/update-super-dm-setting.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('super-dm')
export class SuperDmController {
  constructor(private superDmService: SuperDmService) {}

  // update super dm settings
  @Put('/settings')
  async updateSettings(
    @Body() dto: UpdateSuperDmSettingDto,
    @CurrentUser() user: User,
  ) {
    await this.superDmService.updateSettings(dto, user);
    return { message: 'Super DM settings updated' };
  }
}
