import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipReplyDto } from './dtos/create-tip-reply.dto';
import { TipsService } from 'src/tips/tips.service';
import { TipReply } from './tip-reply.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/shared/constants/enum';
import { User } from 'src/users/user.entity';

@Injectable()
export class TipRepliesService {
  constructor(
    private tipsService: TipsService,
    private caslAbilityFactory: CaslAbilityFactory,

    @InjectRepository(TipReply)
    private repo: Repository<TipReply>,
  ) {}

  async create(dto: CreateTipReplyDto, user: User) {
    const tip = await this.tipsService.findOneById(dto.tipId);
    if (!tip) throw new NotFoundException('Tip is not found.');

    const ability = await this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Create, TipReply))
      throw new UnauthorizedException(
        'You are not authorized to create a tip reply.',
      );

    const created = this.repo.create({
      message: dto.message,
      tip,
    });

    return await this.repo.save(created);
  }
}
