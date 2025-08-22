import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action, RolesEnum } from 'src/shared/constants/enum';
import { User } from 'src/users/user.entity';

type Subjects = InferSubjects<typeof User> | 'notification' | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    const isAdmin = user.roles.includes(RolesEnum.ADMIN);

    if (isAdmin) {
      can(Action.Manage, 'all');
    }

    if (user.isPremium) {
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
