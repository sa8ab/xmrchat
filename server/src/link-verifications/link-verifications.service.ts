import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkVerification } from './link-verification.entity';
import { Repository } from 'typeorm';
import { Link } from 'src/links/link.entity';
import { TwitterVerificationHandler } from './handlers/twitter-verification.handler';
import { LinkPlatformEnum } from 'src/shared/constants';
import { CreateLinkVerificationDto } from './dtos/create-link-verification.dto';
import { PagesService } from 'src/pages/pages.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class LinkVerificationsService {
  constructor(
    @InjectRepository(LinkVerification)
    private repo: Repository<LinkVerification>,
    @InjectRepository(Link)
    private linkRepo: Repository<Link>,
    private twitterVerificationHandler: TwitterVerificationHandler,
    private pagesService: PagesService,
  ) {}

  async findOne(id: number) {
    if (!id) throw new BadRequestException('id is required');
    const linkVerification = await this.repo.findOne({
      where: { id },
    });
    if (!linkVerification)
      throw new NotFoundException('Link verification not found');
    return linkVerification;
  }

  async findOneOptional(id: number) {
    if (!id) return null;
    return this.repo.findOne({
      where: { id },
    });
  }

  async findOneByLinkId(linkId: number) {
    if (!linkId) throw new BadRequestException('linkId is required');
    return this.repo.findOne({
      where: { link: { id: linkId } },
    });
  }

  async create(
    user: User,
    linkType: LinkPlatformEnum,
    dto: CreateLinkVerificationDto,
  ) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    const link = await this.linkRepo.findOne({
      where: {
        page: { id: page.id },
        platform: linkType,
      },
    });
    if (!link) throw new NotFoundException('Link not found');

    if (!link.value)
      throw new BadRequestException('Link value is required for verification.');

    const existingVerification = await this.findOneByLinkId(link.id);

    if (existingVerification)
      throw new BadRequestException('Verification already exists');

    if (linkType === LinkPlatformEnum.X) {
      const result = await this.twitterVerificationHandler.verify({
        page,
        link,
        data: { tweetUrl: dto.url },
      });

      if (!result.valid)
        throw new BadRequestException(result.message || 'Invalid tweet URL');
    } else {
      throw new BadRequestException('Only verification of X is supported.');
    }

    const verification = this.repo.create({
      link,
      url: dto.url,
    });
    return this.repo.save(verification);
  }

  async deleteByLinkId(linkId: number) {
    const verification = await this.findOneByLinkId(linkId);
    if (verification) await this.repo.remove(verification);
  }

  async delete(user: User, linkType: LinkPlatformEnum) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    const link = await this.linkRepo.findOne({
      where: { page: { id: page.id }, platform: linkType },
      relations: { verification: true },
    });
    if (!link) throw new NotFoundException('Link not found');

    if (!link.verification)
      throw new NotFoundException('Verification not found');

    await this.repo.remove(link.verification);
  }
}
