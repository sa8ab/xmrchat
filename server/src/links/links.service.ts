import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './link.entity';
import { And, IsNull, Not, Repository } from 'typeorm';
import { PagesService } from 'src/pages/pages.service';
import { UpdateLinksDto } from './dto/update-links.dto';
import { Page } from 'src/pages/page.entity';
import { contentLinksWithDefaults } from 'src/shared/utils';
import { LinkPlatformEnum, PageStatusEnum } from 'src/shared/constants';

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

  async findByPlatform(platform: LinkPlatformEnum) {
    return this.repo.find({
      where: {
        platform,
        value: And(Not(IsNull()), Not('')),
        page: { status: Not(PageStatusEnum.DEACTIVE), isPublic: true },
      },
      relations: { page: true },
    });
  }

  async updateContentLinks(data: UpdateLinksDto, page: Page) {
    if (
      data.rumbleLiveStreamUrl &&
      !data.links.find((l) => l.platform === LinkPlatformEnum.RUMBLE)
    ) {
      throw new BadRequestException(
        'Add a rumble link to your content links to use live stream URL.',
      );
    }

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
        data: this.getLinkData(data, l.platform),
      };
    });

    return this.repo.upsert(links, ['page.id', 'platform']);
  }

  getLinkData(dto: UpdateLinksDto, platform: LinkPlatformEnum): any {
    if (platform === LinkPlatformEnum.RUMBLE) {
      if (!dto.rumbleLiveStreamUrl) return null;
      return { rumbleLiveStreamUrl: dto.rumbleLiveStreamUrl };
    }

    return null;
  }
}
