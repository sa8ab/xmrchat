import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagesService } from 'src/pages/pages.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CohostService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private pagesService: PagesService,
  ) {}

  async findPageCohosts(pageId: number) {
    if (!pageId) return [];

    return this.usersRepo.find({
      where: {
        cohostPage: { id: pageId },
      },
    });
  }

  // Removes cohost from a page
  async removeCohost(pageId: number, cohostId: number) {
    const cohost = await this.usersRepo.findOneOrFail({
      where: { id: cohostId },
      relations: { cohostPage: true },
    });

    if (!cohost.cohostPage || cohost.cohostPage.id != pageId)
      throw new BadRequestException('User is not a cohost on your page.');

    cohost.cohostPage = null;
    await this.usersRepo.save(cohost);
  }

  async removeMyCohost(userId: number) {
    const cohost = await this.usersRepo.findOneOrFail({
      where: { id: userId },
      relations: { cohostPage: true },
    });

    if (!cohost.cohostPage)
      throw new BadRequestException('You are not a cohost.');

    cohost.cohostPage = null;

    await this.usersRepo.save(cohost);
  }
}
