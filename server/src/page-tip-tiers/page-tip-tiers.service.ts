import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageTipTier } from './page-tip-tier.entity';
import { Repository } from 'typeorm';
import { CreatePageTipTierDto } from './dtos/create-page-tip-tier.dto';
import { File } from 'src/files/file.entity';
import { Action, FileType } from 'src/shared/constants';
import { User } from 'src/users/user.entity';
import { PagesService } from 'src/pages/pages.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { UpdatePageTipTierDto } from './dtos/update-page-tip-tier.dto';

@Injectable()
export class PageTipTiersService {
  constructor(
    private pagesService: PagesService,
    private casl: CaslAbilityFactory,
    @InjectRepository(PageTipTier) private repo: Repository<PageTipTier>,
    @InjectRepository(File) private filesRepo: Repository<File>,
  ) {}

  private MAX_PAGE_TIP_TIERS = 5;

  async findAll(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page is not found');

    const tiers = await this.repo.find({
      where: { page: { id: page.id } },
      relations: { sound: true },
      order: { minAmount: { direction: 'DESC', nulls: 'LAST' } },
    });
    return tiers;
  }

  async findOneById(id: number) {
    if (!id) return null;
    const tier = await this.repo.findOne({
      where: { id },
      relations: { sound: true },
    });
    if (!tier) throw new NotFoundException('Tier is not found');
    return tier;
  }

  async create(dto: CreatePageTipTierDto, user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page is not found');

    const ability = await this.casl.createForUser(user);
    if (!ability.can(Action.Create, PageTipTier))
      throw new UnauthorizedException(
        'You are not authorized to create a page tip tier.',
      );

    const tiers = await this.repo.find({
      where: { page: { id: page.id } },
    });

    if (tiers.length >= this.MAX_PAGE_TIP_TIERS)
      throw new BadRequestException(
        `You have reached the maximum number of page tip tiers (${this.MAX_PAGE_TIP_TIERS}).`,
      );

    let sound: File | undefined;
    if (dto.soundId) {
      sound = await this.filesRepo.findOneBy({ id: dto.soundId });
      if (!sound) throw new NotFoundException('Sound is not found');
      if (sound.type !== FileType.OBS_SOUND)
        throw new BadRequestException('Sound is not a valid OBS sound');
    }

    const created = this.repo.create({
      name: dto.name,
      description: dto.description,
      minAmount: dto.minAmount,
      maxAmount: dto.maxAmount,
      color: dto.color,
      messageLength: dto.messageLength,
      sound,
      page: { id: page.id },
    });

    const tier = await this.repo.save(created);

    return tier;
  }

  async update(id: number, dto: UpdatePageTipTierDto, user: User) {
    const tier = await this.repo.findOne({
      where: { id },
      relations: { sound: true },
    });
    if (!tier) throw new NotFoundException('Tier is not found');

    const ability = await this.casl.createForUser(user);
    if (!ability.can(Action.Update, tier))
      throw new UnauthorizedException(
        'You are not authorized to update a page tip tier.',
      );

    let sound: File | null | undefined = tier.sound;
    if (dto.soundId && dto.soundId !== tier.sound?.id) {
      sound = await this.filesRepo.findOneBy({ id: dto.soundId });
      if (!sound) throw new NotFoundException('Sound is not found');
      if (sound.type !== FileType.OBS_SOUND)
        throw new BadRequestException('Sound is not a valid OBS sound');
    } else if (!dto.soundId) {
      sound = null;
    }

    tier.name = dto.name;
    tier.description = dto.description;
    tier.minAmount = dto.minAmount;
    tier.maxAmount = dto.maxAmount;
    tier.messageLength = dto.messageLength;
    tier.color = dto.color;
    tier.sound = sound;

    const updated = await this.repo.save(tier);
    return updated;
  }

  async delete(id: number, user: User) {
    const tier = await this.repo.findOne({
      where: { id },
      relations: { sound: true },
    });
    if (!tier) throw new NotFoundException('Tier is not found');

    const ability = await this.casl.createForUser(user);
    if (!ability.can(Action.Delete, tier))
      throw new UnauthorizedException(
        'You are not authorized to delete a page tip tier.',
      );

    await this.repo.remove(tier);
  }
}
