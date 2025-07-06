import { Body, Controller, Get, Patch } from '@nestjs/common';
import { PagesService } from 'src/pages/pages.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { NotificationPreferencesService } from './notification-preferences.service';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { NotificationPreferencesRO } from './dto/notification-preference.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preference.dto';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { PageSettingKey } from 'src/shared/constants';

@Controller('notification-preferences')
export class NotificationPreferencesController {
  constructor(
    private pagesService: PagesService,
    private notificationPreferencesService: NotificationPreferencesService,
    private pageSettingsService: PageSettingsService,
  ) {}

  // Get prefences
  @Get()
  @Serialize(NotificationPreferencesRO)
  async getPreferences(@CurrentUser() user: User) {
    const page = await this.pagesService.findMyPage(user);

    const preferences =
      await this.notificationPreferencesService.getNotificationPreferences(
        page.id,
      );

    return { preferences };
  }

  // Update prefences
  @Patch()
  async updatePreferences(
    @CurrentUser() user: User,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    const page = await this.pagesService.findMyPage(user);

    await this.pageSettingsService.upsert(page.id, [
      {
        key: PageSettingKey.MIN_NOTIFICATION_THRESHOLD,
        value: dto.minNotificationThreshold,
      },
    ]);

    await this.notificationPreferencesService.updateNotificationPreferences(
      page.id,
      dto,
    );

    return { message: 'Preferences updated' };
  }
}
