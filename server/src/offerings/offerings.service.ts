import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offering } from './offering.entity';
import { Repository } from 'typeorm';
import { CreateOfferingDto } from './dtos/create-offering.dto';
import { User } from 'src/users/user.entity';
import { PagesService } from 'src/pages/pages.service';
import { UpdateOfferingDto } from './dtos/update-offering.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/shared/constants';

@Injectable()
export class OfferingsService {
  constructor(
    private pagesService: PagesService,
    private casl: CaslAbilityFactory,
    @InjectRepository(Offering) private repo: Repository<Offering>,
  ) {}

  async findAll(user: User) {
    const page = await this.pagesService.findMyPage(user);

    const result = await this.repo.find({
      where: { page: { id: page.id } },
    });

    return result;
  }

  async findOne(id: number, user: User) {
    if (!id) throw new BadRequestException('id is required');

    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page is not found');

    const offering = await this.repo.findOneBy({ id });
    if (!offering) throw new NotFoundException('Offering is not found');

    const casl = await this.casl.createForUser(user);
    if (!casl.can(Action.Read, offering)) throw new UnauthorizedException();

    return offering;
  }

  findOneOptional(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  async create(dto: CreateOfferingDto, user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page is not found');

    const created = this.repo.create({
      name: dto.name,
      description: dto.description,
      amount: dto.amount,
      duration: dto.duration,
      page,
    });
    const offering = await this.repo.save(created);
    return offering;
  }

  async update(id: number, dto: UpdateOfferingDto, user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page is not found');

    const offering = await this.findOneOptional(id);
    if (!offering) throw new NotFoundException('Offering is not found');

    // TODO: Add casl for offering

    Object.assign(offering, dto);
    return this.repo.save(offering);
  }
}
