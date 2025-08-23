import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/pages/page.entity';
import { PagesService } from 'src/pages/pages.service';
import { Action, RolesEnum } from 'src/shared/constants/enum';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

type Subjects = InferSubjects<typeof User> | 'notification' | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(@InjectRepository(Page) private pageRepo: Repository<Page>) {}

  async findUserPage(user: User) {
    if (!user.id) return null;

    return this.pageRepo.findOne({
      where: { user: { id: user.id } },
    });
  }

  async createForUser(user: User, page?: Page) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    const isAdmin = user.roles.includes(RolesEnum.ADMIN);
    const pageResult = page || (await this.findUserPage(user));

    if (isAdmin) {
      can(Action.Manage, 'all');
    }

    if (pageResult?.isPremium) {
      can(Action.Manage, 'notification');
      can(Action.Receive, 'notification');
      can(Action.Manage, 'recipient');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
