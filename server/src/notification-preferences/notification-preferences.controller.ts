import {
  Body,
  Controller,
  Get,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { PagesService } from 'src/pages/pages.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { NotificationPreferencesService } from './notification-preferences.service';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { NotificationPreferencesRO } from './dto/notification-preference.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preference.dto';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import { Action, PageSettingKey } from 'src/shared/constants';
import { MoneroUtils } from 'monero-ts';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Controller('notification-preferences')
export class NotificationPreferencesController {
  constructor(
    private pagesService: PagesService,
    private notificationPreferencesService: NotificationPreferencesService,
    private pageSettingsService: PageSettingsService,
    private casl: CaslAbilityFactory,
  ) {}

  // Get prefences
  @Get()
  @Serialize(NotificationPreferencesRO)
  async getPreferences(@CurrentUser() user: User) {
    const ability = this.casl.createForUser(user);

    if (!ability.can(Action.Manage, 'notification')) {
      throw new UnauthorizedException(
        'You need to be a premium user to manage notification preferences',
      );
    }

    const page = await this.pagesService.findMyPage(user);

    const preferences =
      await this.notificationPreferencesService.getNotificationPreferences(
        page.id,
      );

    const minThreshold = await this.pageSettingsService.getSettingValue(
      page.path,
      PageSettingKey.MIN_NOTIFICATION_THRESHOLD,
    );

    return { preferences, minNotificationThreshold: minThreshold };
  }

  // Update prefences
  @Patch()
  async updatePreferences(
    @CurrentUser() user: User,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    const ability = this.casl.createForUser(user);

    if (!ability.can(Action.Manage, 'notification')) {
      throw new UnauthorizedException(
        'You need to be a premium user to manage notification preferences',
      );
    }

    const page = await this.pagesService.findMyPage(user);

    await this.pageSettingsService.upsert(page.id, [
      {
        key: PageSettingKey.MIN_NOTIFICATION_THRESHOLD,
        value: dto.minNotificationThreshold
          ? MoneroUtils.xmrToAtomicUnits(dto.minNotificationThreshold)
          : null,
      },
    ]);

    await this.notificationPreferencesService.updateNotificationPreferences(
      page.id,
      dto,
    );

    return { message: 'Preferences updated' };
  }
}
