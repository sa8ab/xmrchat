import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/pages/page.entity';
import {
  Action,
  IntegrationConfigType,
  NotificationChannelEnum,
  NotificationPreferenceType,
  PageSettingKey,
} from 'src/shared/constants';
import { Tip } from 'src/tips/tip.entity';
import { Repository } from 'typeorm';
import { EmailService } from './email/email.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { NotificationPreference } from 'src/notification-preferences/notification-preferences.entity';
import { MoneroUtils } from 'monero-ts';
import { PageSetting } from 'src/page-settings/page-setting.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { IntegrationConfig } from 'src/integrations/integration-configs.entity';

@Injectable()
export class NotificationDispatcherService {
  private readonly logger = new Logger(NotificationDispatcherService.name);

  constructor(
    @InjectRepository(Page) private pagesRepo: Repository<Page>,
    @InjectRepository(Tip) private tipsRepo: Repository<Tip>,
    @InjectRepository(NotificationPreference)
    private notificationPreferencesRepo: Repository<NotificationPreference>,
    @InjectRepository(PageSetting)
    private pageSettingsRepo: Repository<PageSetting>,
    @InjectRepository(IntegrationConfig)
    private icRepo: Repository<IntegrationConfig>,
    @InjectQueue('notifications-email') private emailQueue: Queue,
    @InjectQueue('notifications-simplex') private simplexQueue: Queue,
    @InjectQueue('notifications-signal') private singalQueue: Queue,
    private caslAbility: CaslAbilityFactory,
  ) {}
  async notifyNewTip(pageId: number, tipId: number) {
    // get page
    // get user of the page
    const page = await this.pagesRepo.findOne({
      where: { id: pageId },
      relations: { user: true },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }
    const ability = this.caslAbility.createForUser(page.user);
    if (!ability.can(Action.Receive, 'notification')) {
      throw new ForbiddenException('User can not receive notifications');
    }

    // get tip
    const tip = await this.tipsRepo.findOne({
      where: { id: tipId },
      relations: { payment: true },
    });

    if (!tip) {
      throw new NotFoundException('Tip not found');
    }

    // get notification preferences
    const preferences = await this.notificationPreferencesRepo.find({
      where: { page: { id: pageId } },
    });

    const minNotificationThresholdSetting = await this.pageSettingsRepo.findOne(
      {
        where: {
          page: { id: pageId },
          key: PageSettingKey.MIN_NOTIFICATION_THRESHOLD,
        },
      },
    );

    const minNotificationThreshold = minNotificationThresholdSetting?.value;

    const meetsThreshold = this.getMeetsThreshold(
      tip,
      minNotificationThreshold,
    );

    // based on preferences, send email, telegram, etc
    for (const preference of preferences) {
      if (
        preference.type === NotificationPreferenceType.NEW_TIP &&
        !meetsThreshold
      )
        continue;

      if (
        preference.channel === NotificationChannelEnum.EMAIL &&
        preference.type === NotificationPreferenceType.NEW_TIP
      ) {
        await this.notifyNewTipEmail(tip, page);
      }

      if (
        preference.channel === NotificationChannelEnum.SIMPLEX &&
        preference.type === NotificationPreferenceType.NEW_TIP
      ) {
        await this.notifyNewTipSimplex(tip, page);
      }

      if (
        preference.channel === NotificationChannelEnum.SINGAL &&
        preference.type === NotificationPreferenceType.NEW_TIP
      ) {
        await this.notifyNewTipSignal(tip, page);
      }
    }
  }

  async notifyNewTipEmail(tip: Tip, page: Page) {
    await this.emailQueue.add('send-email', {
      to: page.user.email,
      options: {
        subject: 'New tip',
        template: 'new-tip.hbs',
        context: {
          name: tip.name,
          amount: MoneroUtils.atomicUnitsToXmr(tip.payment.amount),
          message: tip.message,
        },
      },
    });
  }

  async notifyNewTipSimplex(tip: Tip, page: Page) {
    const config = await this.getSimplexConfig(page.id);
    if (!config?.valid) {
      this.logger.error(
        `Simplex config not set for page ${page.path} but settings are enabled for new tip.`,
      );
      return;
    }

    await this.simplexQueue.add('send-message', {
      contactId: config.config.contactId,
      message: `New tip from ${tip.name}\nAmount: ${MoneroUtils.atomicUnitsToXmr(tip.payment.amount)} XMR\nMessage: ${tip.message || '-'}`,
    });
  }

  async notifyNewTipSignal(tip: Tip, page: Page) {
    const config = await this.getSignalConfig(page.id);
    if (!config?.valid) {
      this.logger.error(
        `Signal config not set for page ${page.path} but settings are enabled for new tip.`,
      );
      return;
    }

    await this.singalQueue.add('send-message', {
      account: config.config.number,
      message: `New tip from ${tip.name}\nAmount: ${MoneroUtils.atomicUnitsToXmr(tip.payment.amount)} XMR\nMessage: ${tip.message || '-'}`,
    });
  }

  getMeetsThreshold(tip: Tip, minNotificationThreshold: string) {
    const tipAmount = MoneroUtils.atomicUnitsToXmr(tip.payment.amount);
    const minNotificationThresholdAmount = MoneroUtils.atomicUnitsToXmr(
      minNotificationThreshold || '0',
    );

    return tipAmount >= minNotificationThresholdAmount;
  }

  async getSimplexConfig(pageId: number) {
    return this.icRepo.findOne({
      where: { page: { id: pageId }, type: IntegrationConfigType.SIMPLEX },
    });
  }

  async getSignalConfig(pageId: number) {
    return this.icRepo.findOne({
      where: { page: { id: pageId }, type: IntegrationConfigType.SINGAL },
    });
  }
}
