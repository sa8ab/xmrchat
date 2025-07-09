import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreference } from './notification-preferences.entity';
import { Repository } from 'typeorm';
import { PagesService } from 'src/pages/pages.service';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preference.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Page } from 'src/pages/page.entity';
import {
  NotificationChannelEnum,
  NotificationPreferenceType,
} from 'src/shared/constants';

@Injectable()
export class NotificationPreferencesService {
  constructor(
    @InjectRepository(NotificationPreference)
    private repo: Repository<NotificationPreference>,
    private pagesService: PagesService,
    @InjectQueue('notifications-daily-summary')
    private dailySummaryQueue: Queue,
  ) {}

  async getNotificationPreferences(pageId: number) {
    const page = await this.pagesService.findById(pageId);
    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const preferences = await this.repo.find({
      where: { page: { id: page.id } },
    });

    return preferences;
  }

  async updateNotificationPreferences(
    pageId: number,
    dto: UpdateNotificationPreferencesDto,
  ) {
    const page = await this.pagesService.findById(pageId);
    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const preferences = dto.preferences;

    await this.repo.upsert(
      preferences.map((p) => ({
        page,
        type: p.type,
        channel: p.channel,
        enabled: p.enabled,
      })),
      {
        conflictPaths: ['page.id', 'type', 'channel'],
      },
    );

    await this.updateDailySummaryQueue(page, dto);
  }

  async updateDailySummaryQueue(
    page: Page,
    dto: UpdateNotificationPreferencesDto,
  ) {
    const dailySummaryTime = dto.dailySummaryTime;
    const dailySummaryEnabled = dto.preferences.find(
      (p) =>
        p.type === NotificationPreferenceType.DAILY_SUMMARY &&
        p.channel === NotificationChannelEnum.EMAIL,
    )?.enabled;

    if (!dailySummaryTime || !dailySummaryEnabled) {
      await this.dailySummaryQueue.removeJobScheduler(
        `daily-summary-${page.id}`,
      );
      return;
    }

    console.log(dailySummaryTime, dailySummaryEnabled);
    const [hour, minute] = dailySummaryTime.split(':');
    const cron = `${minute} ${hour} * * *`;

    await this.dailySummaryQueue.upsertJobScheduler(
      `daily-summary-${page.id}`,
      // { pattern: cron },
      { every: 1000 * 60 },
      { data: { pageId: page.id } },
    );
  }
}
