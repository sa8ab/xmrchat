import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageTipTier } from './page-tip-tier.entity';
import { Repository } from 'typeorm';
import { CreatePageTipTierDto } from './dtos/create-page-tip-tier.dto';
import { File } from 'src/files/file.entity';
import { FileType } from 'src/shared/constants';

@Injectable()
export class PageTipTiersService {
  constructor(
    @InjectRepository(PageTipTier) private repo: Repository<PageTipTier>,
    @InjectRepository(File) private filesRepo: Repository<File>,
  ) {}

  async findAll(pageId: number) {
    const tiers = await this.repo.find({
      where: { page: { id: pageId } },
      relations: { sound: true },
    });
    return tiers;
  }

  async create(pageId: number, dto: CreatePageTipTierDto) {
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
      sound,
      page: { id: pageId },
    });

    const tier = await this.repo.save(created);

    return tier;
  }
}
