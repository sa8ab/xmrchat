import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesService } from 'src/notification-preferences/notification-preferences.service';
import { Page } from 'src/pages/page.entity';
import {
  NotificationChannelEnum,
  NotificationPreferenceType,
} from 'src/shared/constants';
import { Tip } from 'src/tips/tip.entity';
import { Repository } from 'typeorm';
import { EmailService } from './email/email.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { NotificationPreference } from 'src/notification-preferences/notification-preferences.entity';
import { MoneroUtils } from 'monero-ts';

@Injectable()
export class NotificationDispatcherService {
  constructor(
    @InjectRepository(Page) private pagesRepo: Repository<Page>,
    @InjectRepository(Tip) private tipsRepo: Repository<Tip>,
    @InjectRepository(NotificationPreference)
    private notificationPreferencesRepo: Repository<NotificationPreference>,
    @InjectQueue('notifications-email') private emailQueue: Queue,
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

    // based on preferences, send email, telegram, etc
    for (const preference of preferences) {
      if (
        preference.channel === NotificationChannelEnum.EMAIL &&
        preference.type === NotificationPreferenceType.NEW_TIP
      ) {
        await this.emailQueue.add('send-email', {
          type: 'send-email',
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
    }
  }
}
