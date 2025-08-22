import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRecipientsDto } from './dtos/update-recipient.dto';
import { PageRecipient } from './page-recipient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { PagesService } from 'src/pages/pages.service';
import { Page } from 'src/pages/page.entity';

@Injectable()
export class PageRecipientsService {
  constructor(
    @InjectRepository(PageRecipient)
    private repo: Repository<PageRecipient>,
    @InjectRepository(Page)
    private pageRepo: Repository<Page>,
    private pagesService: PagesService,
  ) {}

  async findMyRecipients(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found!');

    const recipients = await this.repo.find({
      where: { page: { id: page.id } },
    });

    return recipients;
  }

  async updateRecipients(dto: UpdateRecipientsDto, user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found!');

    const newRecipients = dto.recipients.map((recipientDto) => {
      const recipient = this.repo.create({
        name: recipientDto.name,
        address: recipientDto.address,
        percentage: recipientDto.percentage,
        variant: recipientDto.variant,
      });
      return recipient;
    });

    return this.repo.manager.transaction(async (manager) => {
      await manager.delete(PageRecipient, {
        page: { id: page.id },
      });

      page.recipients = newRecipients;
      await manager.save(page);

      return page.recipients;
    });
  }
}
