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
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { NotificationPreference } from 'src/notification-preferences/notification-preferences.entity';
import { MoneroUtils } from 'monero-ts';
import { PageSetting } from 'src/page-settings/page-setting.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { IntegrationConfig } from 'src/integrations/integration-configs.entity';
import { SuperDm } from 'src/super-dms/super-dm.entity';
import { SuperDmMessage } from 'src/super-dms/super-sm-message.entity';

@Injectable()
export class NotificationDispatcherService {
  private readonly logger = new Logger(NotificationDispatcherService.name);

  constructor(
    @InjectRepository(Page) private pagesRepo: Repository<Page>,
    @InjectRepository(Tip) private tipsRepo: Repository<Tip>,
    @InjectRepository(SuperDm) private superDmsRepo: Repository<SuperDm>,
    @InjectRepository(SuperDmMessage)
    private superDmMessagesRepo: Repository<SuperDmMessage>,
    @InjectRepository(NotificationPreference)
    private notificationPreferencesRepo: Repository<NotificationPreference>,
    @InjectRepository(PageSetting)
    private pageSettingsRepo: Repository<PageSetting>,
    @InjectRepository(IntegrationConfig)
    private icRepo: Repository<IntegrationConfig>,
    @InjectQueue('notifications-email') private emailQueue: Queue,
    @InjectQueue('notifications-simplex') private simplexQueue: Queue,
    @InjectQueue('notifications-signal') private signalQueue: Queue,
    private caslAbility: CaslAbilityFactory,
  ) {}
  async notifyNewTip(pageId: number, tipId: number) {
    const page = await this.pagesRepo.findOne({
      where: { id: pageId },
      relations: { user: true },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }
    const ability = await this.caslAbility.createForUser(page.user, page);
    if (!ability.can(Action.Receive, 'notification')) {
      return;
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

    // based on preferences, send email, simplex, signal, etc
    for (const preference of preferences.filter(
      (p) => p.type === NotificationPreferenceType.NEW_TIP,
    )) {
      if (!meetsThreshold) continue;
      if (!preference.enabled) continue;

      if (preference.channel === NotificationChannelEnum.EMAIL) {
        await this.notifyNewTipEmail(tip, page);
      }

      if (preference.channel === NotificationChannelEnum.SIMPLEX) {
        await this.notifyNewTipSimplex(tip, page);
      }

      if (preference.channel === NotificationChannelEnum.SIGNAL) {
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

    await this.signalQueue.add('send-message', {
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
      where: { page: { id: pageId }, type: IntegrationConfigType.SIGNAL },
    });
  }

  async notifyNewSuperDm(pageId: number, superDmId: string) {
    const page = await this.pagesRepo.findOne({
      where: { id: pageId },
      relations: { user: true },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }
    const ability = await this.caslAbility.createForUser(page.user, page);
    if (!ability.can(Action.Receive, 'notification')) {
      return;
    }

    // get super dm
    const superDm = await this.superDmsRepo.findOne({
      where: { id: superDmId },
      relations: { payment: true },
    });

    if (!superDm) {
      throw new NotFoundException('Super DM not found');
    }

    // get notification preferences
    const preferences = await this.notificationPreferencesRepo.find({
      where: { page: { id: pageId } },
    });

    // based on preferences, send email, simplex, signal, etc
    for (const preference of preferences.filter(
      (p) => p.type === NotificationPreferenceType.SUPER_DM,
    )) {
      if (!preference.enabled) continue;

      if (preference.channel === NotificationChannelEnum.EMAIL) {
        await this.notifyNewSuperDmEmail(superDm, page);
      }

      if (preference.channel === NotificationChannelEnum.SIMPLEX) {
        await this.notifyNewSuperDmSimplex(superDm, page);
      }

      if (preference.channel === NotificationChannelEnum.SIGNAL) {
        await this.notifyNewSuperDmSignal(superDm, page);
      }
    }
  }

  async notifyNewSuperDmEmail(superDm: SuperDm, page: Page) {
    await this.emailQueue.add('send-email', {
      to: page.user.email,
      options: {
        subject: 'New Super DM',
        template: 'new-super-dm.hbs',
        context: {
          name: superDm.name,
          amount: MoneroUtils.atomicUnitsToXmr(superDm.payment.amount),
        },
      },
    });
  }

  async notifyNewSuperDmSimplex(superDm: SuperDm, page: Page) {
    const config = await this.getSimplexConfig(page.id);
    if (!config?.valid) {
      this.logger.error(
        `Simplex config not set for page ${page.path} but settings are enabled for new super DM.`,
      );
      return;
    }

    await this.simplexQueue.add('send-message', {
      contactId: config.config.contactId,
      message: `New Super DM from ${superDm.name}\nAmount: ${MoneroUtils.atomicUnitsToXmr(superDm.payment.amount)} XMR`,
    });
  }

  async notifyNewSuperDmSignal(superDm: SuperDm, page: Page) {
    const config = await this.getSignalConfig(page.id);
    if (!config?.valid) {
      this.logger.error(
        `Signal config not set for page ${page.path} but settings are enabled for new super DM.`,
      );
      return;
    }

    await this.signalQueue.add('send-message', {
      account: config.config.number,
      message: `New Super DM from ${superDm.name}\nAmount: ${MoneroUtils.atomicUnitsToXmr(superDm.payment.amount)} XMR`,
    });
  }

  async notifySuperDmMessage(
    pageId: number,
    superDmId: string,
    messageId: number,
  ) {
    const page = await this.pagesRepo.findOne({
      where: { id: pageId },
      relations: { user: true },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }
    const ability = await this.caslAbility.createForUser(page.user, page);
    if (!ability.can(Action.Receive, 'notification')) {
      return;
    }

    // get super dm
    const superDm = await this.superDmsRepo.findOne({
      where: { id: superDmId },
      relations: { payment: true },
    });

    if (!superDm) {
      throw new NotFoundException('Super DM not found');
    }

    // get message
    const message = await this.superDmMessagesRepo.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Super DM message not found');
    }

    // get notification preferences
    const preferences = await this.notificationPreferencesRepo.find({
      where: { page: { id: pageId } },
    });

    // based on preferences, send email, simplex, signal, etc
    for (const preference of preferences.filter(
      (p) => p.type === NotificationPreferenceType.SUPER_DM,
    )) {
      if (!preference.enabled) continue;

      if (preference.channel === NotificationChannelEnum.EMAIL) {
        await this.notifySuperDmMessageEmail(superDm, message, page);
      }

      if (preference.channel === NotificationChannelEnum.SIMPLEX) {
        await this.notifySuperDmMessageSimplex(superDm, message, page);
      }

      if (preference.channel === NotificationChannelEnum.SIGNAL) {
        await this.notifySuperDmMessageSignal(superDm, message, page);
      }
    }
  }

  async notifySuperDmMessageEmail(
    superDm: SuperDm,
    message: SuperDmMessage,
    page: Page,
  ) {
    await this.emailQueue.add('send-email', {
      to: page.user.email,
      options: {
        subject: 'New Super DM Message',
        template: 'super-dm-message.hbs',
        context: {
          name: superDm.name,
        },
      },
    });
  }

  async notifySuperDmMessageSimplex(
    superDm: SuperDm,
    message: SuperDmMessage,
    page: Page,
  ) {
    const config = await this.getSimplexConfig(page.id);
    if (!config?.valid) {
      this.logger.error(
        `Simplex config not set for page ${page.path} but settings are enabled for super DM message.`,
      );
      return;
    }

    await this.simplexQueue.add('send-message', {
      contactId: config.config.contactId,
      message: `New message in Super DM from ${superDm.name}`,
    });
  }

  async notifySuperDmMessageSignal(
    superDm: SuperDm,
    message: SuperDmMessage,
    page: Page,
  ) {
    const config = await this.getSignalConfig(page.id);
    if (!config?.valid) {
      this.logger.error(
        `Signal config not set for page ${page.path} but settings are enabled for super DM message.`,
      );
      return;
    }

    await this.signalQueue.add('send-message', {
      account: config.config.number,
      message: `New message in Super DM from ${superDm.name}`,
    });
  }
}
