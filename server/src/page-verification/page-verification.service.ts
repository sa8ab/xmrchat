import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageVerification } from './page-verification.entity';
import { Repository } from 'typeorm';
import { PageVerificationTypeEnum } from 'src/shared/constants';
import { CreatePageVerificationDto } from './dtos/create-page-verification.dto';
import { PagesService } from 'src/pages/pages.service';
import { User } from 'src/users/user.entity';
import { TwitterVerificationHandler } from './handlers/twitter-verification.handler';

@Injectable()
export class PageVerificationService {
  constructor(
    @InjectRepository(PageVerification)
    private repo: Repository<PageVerification>,
    private twitterVerificationHandler: TwitterVerificationHandler,
    private pagesService: PagesService,
  ) {}

  async findOne(id: number) {
    if (!id) throw new BadRequestException('id is required');

    const pageVerification = await this.repo.findOneBy({ id });
    if (!pageVerification)
      throw new NotFoundException('Page verification not found');
    return pageVerification;
  }

  async findOneByType(pageId: number, type: PageVerificationTypeEnum) {
    if (!pageId) throw new BadRequestException('pageId is required');

    const pageVerification = await this.repo.findOne({
      where: { page: { id: pageId }, type },
    });
    return pageVerification;
  }

  async findByUser(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');
    return this.repo.find({ where: { page: { id: page.id } } });
  }

  async create(user: User, dto: CreatePageVerificationDto) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) throw new NotFoundException('Page not found');

    const existingVerification = await this.findOneByType(page.id, dto.type);
    if (existingVerification)
      throw new BadRequestException('Verification already exists');

    const type = dto.type;
    let verifiedUrl: string;
    let name: string;
    if (type === PageVerificationTypeEnum.X) {
      const result = await this.twitterVerificationHandler.verify({
        page,
        data: { tweetUrl: dto.url },
      });
      if (!result.valid) throw new BadRequestException('Invalid tweet URL');
      verifiedUrl = result.verifiedUrl;
      name = result.name;
    }

    const verification = this.repo.create({
      page: { id: page.id },
      type: dto.type,
      url: dto.url,
      verifiedUrl,
      name,
    });

    return this.repo.save(verification);
  }
}
