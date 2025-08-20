import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRecipientsDto } from './dtos/update-recipient.dto';
import { PageRecipient } from './page-recipient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { PagesService } from 'src/pages/pages.service';

@Injectable()
export class PageRecipientsService {
  constructor(
    @InjectRepository(PageRecipient)
    private repo: Repository<PageRecipient>,
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

  updateRecipients(dto: UpdateRecipientsDto) {
    console.log(dto);
  }
}
