import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './link.entity';
import { Repository } from 'typeorm';
import { PagesService } from 'src/pages/pages.service';
import { UpdateLinksDto } from './dto/update-links.dto';
import { Page } from 'src/pages/page.entity';
import { contentLinksWithDefaults } from 'src/shared/utils';
import { LinkPlatformEnum } from 'src/shared/constants';

@Injectable()
export class LinksService {
  constructor(
    private pagesService: PagesService,
    @InjectRepository(Link) private repo: Repository<Link>,
  ) {}

  async findByPageId(id: number) {
    if (!id) return null;

    const res = await this.repo.findBy({ page: { id } });

    return contentLinksWithDefaults(res);
  }

  async updateContentLinks(data: UpdateLinksDto, page: Page) {
    // update name and search term from pages
    await this.pagesService.updateNameAndSearchTerms(page.id, {
      name: data.name,
      searchTerms: data.searchTerms,
    });

    // upsert
    const links = data.links.map((l) => {
      return {
        page: { id: page.id },
        platform: l.platform,
        value: l.value,
        data: null,
      };
    });

    return this.repo.upsert(links, ['page.id', 'platform']);
  }
}
