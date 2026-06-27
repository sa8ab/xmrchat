import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PagesService } from 'src/pages/pages.service';
import { PageSettingsService } from 'src/page-settings/page-settings.service';
import {
  Action,
  PageSettingCategory,
  PageSettingKey,
} from 'src/shared/constants';
import { User } from 'src/users/user.entity';
import { UpdateTipReplySettingsDto } from './dtos/update-tip-reply-settings.dto';
import { TipReply } from './tip-reply.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Injectable()
export class TipReplySettingsService {
  constructor(
    private pagesService: PagesService,
    private pageSettingsService: PageSettingsService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async getSettings(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    return this.getSettingsByPageId(page.id);
  }

  async getSettingsByPageSlug(pageSlug: string) {
    const page = await this.pagesService.findByPath(pageSlug);
    if (!page) throw new NotFoundException('Page not found');

    return this.getSettingsByPageId(page.id);
  }

  async updateSettings(dto: UpdateTipReplySettingsDto, user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    const ability = await this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Update, TipReply))
      throw new UnauthorizedException(
        'You are not authorized to update tip reply settings.',
      );

    await this.pageSettingsService.upsert(
      page.id,
      [
        {
          key: PageSettingKey.TIP_REPLY_BACKGROUND_COLOR,
          value: dto.backgroundColor,
        },
        {
          key: PageSettingKey.TIP_REPLY_TEXT_COLOR,
          value: dto.textColor,
        },
      ],
      user,
    );
  }

  private async getSettingsByPageId(pageId: number) {
    const settings = await this.pageSettingsService.getByPageId(
      pageId,
      PageSettingCategory.TIP_REPLIES,
    );

    const backgroundColor = settings?.find(
      (s) => s.key === PageSettingKey.TIP_REPLY_BACKGROUND_COLOR,
    )?.value;

    const textColor = settings?.find(
      (s) => s.key === PageSettingKey.TIP_REPLY_TEXT_COLOR,
    )?.value;

    return { backgroundColor, textColor };
  }
}
