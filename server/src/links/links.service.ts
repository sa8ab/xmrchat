import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './link.entity';
import { Repository } from 'typeorm';
import { PagesService } from 'src/pages/pages.service';

@Injectable()
export class LinksService {
  constructor(
    private pagesService: PagesService,
    @InjectRepository(Link) private repo: Repository<Link>,
  ) {}

  async findByPageId(id: number) {
    if (!id) return null;

    return this.repo.findBy({ page: { id } });
  }

  async updateContentLinks() {}
}
