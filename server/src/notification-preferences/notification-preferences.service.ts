import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreference } from './notification-preferences.entity';
import { Repository } from 'typeorm';
import { PagesService } from 'src/pages/pages.service';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preference.dto';

@Injectable()
export class NotificationPreferencesService {
  constructor(
    @InjectRepository(NotificationPreference)
    private repo: Repository<NotificationPreference>,
    private pagesService: PagesService,
  ) {}

  async getNotificationPreferences(pageId: number) {
    const page = await this.pagesService.findById(pageId);
    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const preferences = await this.repo.find({
      where: { page },
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
  }
}
