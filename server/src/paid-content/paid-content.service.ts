import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PaidContent } from './paid-content.entity';
import { PagesService } from 'src/pages/pages.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Action } from 'src/shared/constants';
import { CreatePaidContentDto } from './dtos/create-paid-content.dto';

@Injectable()
export class PaidContentService {
  constructor(
    private pagesService: PagesService,
    private casl: CaslAbilityFactory,
    @InjectRepository(PaidContent) private repo: Repository<PaidContent>,
  ) {}

  async findAll(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page is not found');

    const result = await this.repo.find({ where: { page: { id: page.id } } });
    return result;
  }

  async findOne(id: number, user: User) {
    if (!id) throw new BadRequestException('id is required');

    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page is not found');

    const paidContent = await this.repo.findOneBy({ id });
    if (!paidContent) throw new NotFoundException('Paid content is not found');

    const casl = await this.casl.createForUser(user);
    if (!casl.can(Action.Read, paidContent)) throw new UnauthorizedException();

    return paidContent;
  }

  async create(dto: CreatePaidContentDto, user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page is not found');

    const created = this.repo.create({
      name: dto.name,
      description: dto.description,
      amount: dto.amount,
      duration: dto.duration,
      page,
    });
    const result = await this.repo.save(created);
    return result;
  }
}
